import { z } from "zod";
import { Input } from "../input";
import { requiredAddress } from "@/lib/validations";
import { ChainType, CustomChainPayload, CustomChain } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomChain } from "@/hooks/use-custom-chain";
import { useAccount } from "wagmi";
import { useSelectedChain } from "@/hooks/use-selected-chain";
import { useNavigate } from "@tanstack/react-router";
import Button from "../button";
import { l2Chain } from "@/lib/wagmi-config";
import { EnumSelect } from "../enum-select";
import CustomChainService from "@/services/custom-chain-service";
import { Address } from "viem";

const schema = (editing: boolean, userAddress?: Address) =>
  z.object({
    chainId: z
      .preprocess((val) => Number(val), z.number().min(1))
      .refine(
        (val) => editing || !CustomChainService.getChainById(val, userAddress),
        {
          message: "Chain already exists",
        },
      ),
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
    nativeCurrencyDecimals: z.preprocess(
      (val) => Number(val),
      z.number().min(1),
    ),
    explorerUrl: z.string().url().min(1),
    publicRpcUrl: z.string().url().min(1),
    localRpcUrl: z.string().url().min(1),
    logoURI: z.string().url().optional(),
    chainType: z.nativeEnum(ChainType, {
      required_error: "Chain type is required",
    }),
  });

export const ChainForm = ({
  chain,
  editing = false,
}: {
  chain?: CustomChain | null;
  editing?: boolean;
}) => {
  const { address } = useAccount();
  const { createChain, editChain } = useCustomChain();
  const { setSelectedChain } = useSelectedChain();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema(editing, address!)),
    defaultValues: {
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
      chainType: ChainType.L3,
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    const payload: CustomChainPayload = {
      ...data,
      user: address,
      parentChainId: l2Chain.id,
    };
    if (address) {
      if (editing) setSelectedChain(await editChain(payload));
      else setSelectedChain(await createChain(payload));

      navigate({ to: "/" });
    }
  };
  return (
    <section className="max-w-xl mx-auto">
      <h1 className="text-2xl text-black text-left">
        {editing ? "Edit" : "Add"} Chain
      </h1>
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
          <EnumSelect
            name="chainType"
            label="Chain Type"
            enumValues={ChainType}
            register={register}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </section>
  );
};
