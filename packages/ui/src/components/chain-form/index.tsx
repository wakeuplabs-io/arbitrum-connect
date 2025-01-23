import { z } from "zod";
import { Input } from "../input";
import { requiredAddress } from "@/lib/validations";
import { ChainType, CreateChainPayload, CustomChain } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomChain } from "@/hooks/use-custom-chain";
import { useAccount } from "wagmi";
import { useSelectedChain } from "@/hooks/use-selected-chain";
import { useNavigate } from "@tanstack/react-router";

const schema = z.object({
  chainId: z.preprocess((val) => Number(val), z.number().min(1)),
  name: z.string().min(1, { message: "Required" }),
  parentChainId: z.preprocess((val) => Number(val), z.number().min(1)),

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
  publicRpcUrl: z.string().url().min(1),
  localRpcUrl: z.string().url().min(1),
  logoURI: z.string().url().optional(),
  chainType: z.nativeEnum(ChainType, {
    required_error: "Chain type is required",
  }),
});

// Todo: improve valids
export const ChainForm = ({ chain }: { chain?: CustomChain | null }) => {
  const { address } = useAccount();
  const { createChain } = useCustomChain();
  const { setSelectedChain } = useSelectedChain();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
     defaultValues: {
      chainId: chain?.chainId,
      name: chain?.name,
      parentChainId: chain?.parentChainId,
      bridge: chain?.ethBridge?.bridge,
      inbox: chain?.ethBridge?.inbox,
      sequencerInbox: chain?.ethBridge?.sequencerInbox,
      outbox: chain?.ethBridge?.outbox,
      rollup: chain?.ethBridge?.rollup,
      nativeCurrencyName: chain?.nativeCurrency.name,
      nativeCurrencySymbol: chain?.nativeCurrency.symbol,
      nativeCurrencyDecimals: chain?.nativeCurrency.decimals,
      publicRpcUrl: chain?.rpcUrls.default.http[0],
      localRpcUrl: chain?.rpcUrls.default.http[0],
      logoURI: chain?.logoURI,
      chainType: ChainType.L3, // Assuming ChainType is an enum with L1, L2, etc.
    }, 
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    const payload: CreateChainPayload = {
      ...data,
      user: address,
    };
    if (address) {
      const newChain = await createChain(payload);
      setSelectedChain(newChain);
      navigate({ to: "/" });
    }
  };
  return (
    <section className="max-w-xl mx-auto">
      <div className=" bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
        <h1 className="text-2xl text-black text-left">Add Chain</h1>
        <form
          className="mt-8 w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            name="chainId"
            type="number"
            label="Chain id"
            placeholder="Chain ID"
            register={register}
          />
          <Input
            name="name"
            label="Chain name"
            placeholder="Chain name"
            register={register}
          />
          {/* //TODO: Add parent chain id validation, it must exist before creating the new one */}
          <Input
            name="parentChainId"
            label="Parent chain id"
            placeholder="Parent chain ID"
            register={register}
          />
          <Input
            name="bridge"
            label="Bridge"
            placeholder="Bridge"
            register={register}
          />
          <Input
            name="inbox"
            label="Inbox"
            placeholder="Inbox"
            register={register}
          />
          <Input
            name="sequencerInbox"
            label="Sequencer Inbox"
            placeholder="Sequencer Inbox"
            register={register}
          />
          <Input
            name="outbox"
            label="Outbox"
            placeholder="Outbox"
            register={register}
          />
          <Input
            name="rollup"
            label="Rollup"
            placeholder="Rollup"
            register={register}
          />
          <Input
            name="nativeCurrencyName"
            label="Native Currency Name"
            placeholder="Native Currency Name"
            register={register}
          />
          <Input
            name="nativeCurrencySymbol"
            label="Native Currency Symbol"
            placeholder="Native Currency Symbol"
            register={register}
          />
          <Input
            name="nativeCurrencyDecimals"
            type="number"
            label="Native Currency Decimals"
            placeholder="Native Currency Decimals"
            register={register}
          />
          <Input
            name="publicRpcUrl"
            label="Public RPC URL"
            placeholder="Public RPC URL"
            register={register}
            type="url"
          />
          <Input
            name="localRpcUrl"
            label="Local RPC URL"
            placeholder="Local RPC URL"
            register={register}
            type="url"
          />
          <Input
            name="logoURI"
            label="Logo URI"
            placeholder="Logo URI"
            register={register}
            type="url"
          />
          <Input
            name="chainType"
            label="Chain Type"
            placeholder="Chain Type"
            register={register}
          />
          <input type="submit" />
        </form>
      </div>
    </section>
  );
};
