import { z } from "zod";
import { Input } from "../input";
import { requiredAddress } from "@/lib/validations";
import { ChainType, CustomChainPayload, CustomChain } from "@/types";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomChain } from "@/hooks/use-custom-chain";
import { useAccount } from "wagmi";
import { useSelectedChain } from "@/hooks/use-selected-chain";
import { useNavigate } from "@tanstack/react-router";
import Button from "../button";
import {
  customSepolia,
  customArbitrumSepolia,
  customArbitrum,
  customMainnet,
} from "@/lib/wagmi-config";
import { EnumSelect } from "../enum-select";
import CustomChainService from "@/services/custom-chain-service";
import { useEffect } from "react";
import { Checkbox } from "../checkbox";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const schema = z.object({
  chainId: z.preprocess((val) => Number(val), z.number().min(1)),
  name: z.string().min(1, { message: "Required" }),

  // EthBridge fields
  bridge: requiredAddress,
  inbox: requiredAddress,
  sequencerInbox: requiredAddress,
  outbox: requiredAddress,
  rollup: requiredAddress,

  // Separated NetworkConfig fields
  nativeCurrencyName: z.string().min(1, { message: "Required" }),
  nativeCurrencySymbol: z.string().min(1, { message: "Required" }),
  nativeCurrencyDecimals: z.preprocess((val) => Number(val), z.number().min(1)),
  explorerUrl: z.string().url().min(1),
  publicRpcUrl: z.string().url().min(1),
  localRpcUrl: z.string().url().min(1),
  logoURI: z.string().url().optional(),
  chainType: z.nativeEnum(ChainType, {
    required_error: "Chain type is required",
  }),
  isTestnet: z.boolean(),
});

export const ChainForm = ({
  chain,
  editing = false,
}: {
  chain?: CustomChain | null;
  editing: boolean;
}) => {
  const { address } = useAccount();
  const { createChain, editChain } = useCustomChain();
  const { setSelectedChain } = useSelectedChain();
  const navigate = useNavigate();
  const { openConnectModal } = useConnectModal();

  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    values: {
      chainId: chain?.chainId,
      name: chain?.name,
      bridge: chain?.ethBridge?.bridge,
      inbox: chain?.ethBridge?.inbox,
      sequencerInbox: chain?.ethBridge?.sequencerInbox,
      outbox: chain?.ethBridge?.outbox,
      rollup: chain?.ethBridge?.rollup,
      explorerUrl: chain?.explorer.default.url,
      nativeCurrencyName: chain?.nativeCurrency.name,
      nativeCurrencySymbol: chain?.nativeCurrency.symbol,
      nativeCurrencyDecimals: chain?.nativeCurrency.decimals,
      publicRpcUrl: chain?.rpcUrls.default.http[0],
      localRpcUrl: chain?.rpcUrls.default.http[0],
      logoURI: chain?.logoURI,
      chainType: chain?.chainType,
      isTestnet: chain?.isTestnet,
    },
  });
  const chainId = useWatch({ control, name: "chainId" });

  const onSubmit = async (data: any) => {
    let parentChainId;
    if (data.chainType === ChainType.L3)
      parentChainId = data.isTestnet ? customArbitrumSepolia.chainId : customArbitrum.chainId;
    if (data.chainType === ChainType.L2)
      parentChainId = data.isTestnet ? customSepolia.chainId : customMainnet.chainId;

    if (!parentChainId) throw new Error("invalid chainType");
    const payload: CustomChainPayload = {
      ...data,
      user: address,
      parentChainId,
    };
    if (address) {
      if (editing) setSelectedChain(await editChain(payload));
      else setSelectedChain(await createChain(payload));

      navigate({ to: "/" });
    }
  };

  useEffect(() => {
    if (!chainId || editing) return;

    const validateChainId = async () => {
      const chainExists = await CustomChainService.getChainById(
        Number(chainId),
        address,
      );
      if (chainExists) {
        // on submit button disabled checks for this error since async validation couldn't be achieved through Zod + react-hook-forms
        setError("chainId", {
          type: "manual",
          message: "Chain already exists",
        });
      } else {
        clearErrors("chainId");
      }
    };

    validateChainId();
  }, [chainId, address, editing, setError, clearErrors]);

  return (
    <section className="max-w-xl mx-auto">
      <h1 className="text-2xl text-black text-left">
        {editing ? "Edit" : "Add"} Chain
      </h1>
      {!address && (
        <Button
          id="continue-btn"
          onClick={(e) => {
            e.preventDefault();
            if (openConnectModal) {
              openConnectModal();
            }
          }}
          className="w-5/6 mt-8"
          type="submit"
        >
          {address ? "Continue" : "Connect your wallet to get started"}
        </Button>
      )}
      {address && (
        <form
          className="mt-8 w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className=" bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
            <Input
              disabled={editing}
              name="chainId"
              type="number"
              label="Chain id"
              placeholder="Chain ID"
              register={register}
              error={errors.chainId?.message}
            />
            <Input
              name="name"
              label="Chain name"
              placeholder="Chain name"
              register={register}
              error={errors.name?.message}
            />
            <Input
              name="bridge"
              label="Bridge"
              placeholder="Bridge"
              register={register}
              error={errors.bridge?.message}
            />
            <Input
              name="inbox"
              label="Inbox"
              placeholder="Inbox"
              register={register}
              error={errors.inbox?.message}
            />
            <Input
              name="sequencerInbox"
              label="Sequencer Inbox"
              placeholder="Sequencer Inbox"
              register={register}
              error={errors.sequencerInbox?.message}
            />
            <Input
              name="outbox"
              label="Outbox"
              placeholder="Outbox"
              register={register}
              error={errors.outbox?.message}
            />
            <Input
              name="rollup"
              label="Rollup"
              placeholder="Rollup"
              register={register}
              error={errors.rollup?.message}
            />
            <Input
              name="explorerUrl"
              label="Explorer URL"
              placeholder="Explorer URL"
              register={register}
              error={errors.explorerUrl?.message}
            />
            <Input
              name="nativeCurrencyName"
              label="Native Currency Name"
              placeholder="Native Currency Name"
              register={register}
              error={errors.nativeCurrencyName?.message}
            />
            <Input
              name="nativeCurrencySymbol"
              label="Native Currency Symbol"
              placeholder="Native Currency Symbol"
              register={register}
              error={errors.nativeCurrencySymbol?.message}
            />
            <Input
              name="nativeCurrencyDecimals"
              type="number"
              label="Native Currency Decimals"
              placeholder="Native Currency Decimals"
              register={register}
              error={errors.nativeCurrencyDecimals?.message}
            />
            <Input
              name="publicRpcUrl"
              label="Public RPC URL"
              placeholder="Public RPC URL"
              register={register}
              type="url"
              error={errors.publicRpcUrl?.message}
            />
            <Input
              name="localRpcUrl"
              label="Local RPC URL"
              placeholder="Local RPC URL"
              register={register}
              type="url"
              error={errors.localRpcUrl?.message}
            />
            <Input
              name="logoURI"
              label="Logo URI"
              placeholder="Logo URI"
              register={register}
              type="url"
              error={errors.logoURI?.message}
            />
            <Checkbox name="isTestnet" label="Is Testnet" register={register} />
            <EnumSelect
              name="chainType"
              label="Chain Type"
              enumValues={ChainType}
              register={register}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !!errors.chainId || !isValid}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      )}
    </section>
  );
};
