import { z } from "zod";
import { Input } from "../input";
import { requiredAddress } from "@/lib/validations";
import { CustomChainPayload, CustomChain } from "@/types";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomChain } from "@/hooks/use-custom-chain";
import { useAccount } from "wagmi";
import { useSelectedChain } from "@/hooks/use-selected-chain";
import { useNavigate } from "@tanstack/react-router";
import Button from "../button";
import { useEffect } from "react";
import { Checkbox } from "../checkbox";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { TokenBridge } from "@arbitrum/sdk/dist/lib/dataEntities/networks";
import { useChains } from "@/hooks/use-chains";
import { useApiClient } from "@/hooks/use-api-client";

const tokenBridgeObjectSchema: z.ZodType<TokenBridge> = z.object({
  parentGatewayRouter: z.string(),
  childGatewayRouter: z.string(),
  parentErc20Gateway: z.string(),
  childErc20Gateway: z.string(),
  parentCustomGateway: z.string(),
  childCustomGateway: z.string(),
  parentWethGateway: z.string(),
  childWethGateway: z.string(),
  parentWeth: z.string(),
  childWeth: z.string(),
  parentProxyAdmin: z.string(),
  childProxyAdmin: z.string(),
  parentMultiCall: z.string(),
  childMultiCall: z.string(),
});

const schema = z.object({
  chainId: z.coerce.number().min(1),
  name: z.string().min(1, { message: "Required" }),

  // EthBridge fields
  bridge: requiredAddress,
  inbox: requiredAddress,
  sequencerInbox: requiredAddress,
  outbox: requiredAddress,
  rollup: requiredAddress,

  tokenBridge: z
    .string()
    .min(2, { message: "Token bridge config is required" })
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        return tokenBridgeObjectSchema.safeParse(parsed).success;
      } catch {
        return false;
      }
    }, { message: "Invalid tokenBridge structure" }),

  // Separated NetworkConfig fields
  nativeCurrencyName: z.string().min(1, { message: "Required" }),
  nativeCurrencySymbol: z.string().min(1, { message: "Required" }),
  nativeCurrencyDecimals: z.coerce.number().min(1),
  explorerUrl: z.string().url().min(1),
  publicRpcUrl: z.string().url().min(1),

  logoURI: z
    .string()
    .refine(
      (val) => {
        // Accepts absolute URLs or paths that start with /
        return (
          val.startsWith("/") ||
          val.startsWith("http://") ||
          val.startsWith("https://")
        );
      },
      { message: "Must be a URL or a path starting with /" }
    )
    .optional(),
  isTestnet: z.boolean(),
  parentChainId: z.coerce.number().min(1),
});

type ChainFormData = z.infer<typeof schema>;

export const ChainForm = ({
  chain,
  editing = false,
}: {
  chain?: CustomChain | null;
  editing: boolean;
}) => {
  const { address } = useAccount();
  const { createChain, editChain } = useCustomChain();
  const { chains } = useChains();
  const { setSelectedChain } = useSelectedChain();
  const navigate = useNavigate();
  const { openConnectModal } = useConnectModal();
  const client = useApiClient();

  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ChainFormData>({
    resolver: zodResolver(schema),
    defaultValues: chain ? {
        chainId: chain.chainId,
        name: chain.name,
        bridge: chain.ethBridge.bridge as `0x${string}`,
        inbox: chain.ethBridge.inbox as `0x${string}`,
        sequencerInbox: chain.ethBridge.sequencerInbox as `0x${string}`,
        outbox: chain.ethBridge.outbox as `0x${string}`,
        rollup: chain.ethBridge.rollup as `0x${string}`,
        explorerUrl: chain.explorer.default.url,
        nativeCurrencyName: chain.nativeCurrency.name,
        nativeCurrencySymbol: chain.nativeCurrency.symbol,
        nativeCurrencyDecimals: chain.nativeCurrency.decimals,
        publicRpcUrl: chain.rpcUrls.default.http[0],
        logoURI: chain.logoURI,
        isTestnet: chain.isTestnet,
        tokenBridge: chain.tokenBridge ? JSON.stringify(chain.tokenBridge, null, 2) : "",
        parentChainId: chain.parentChainId,
    } : undefined,
  });

  const chainId = useWatch({ control, name: "chainId" });

  const onSubmit = async (data: ChainFormData) => {
    if (!address) return;

    const payload: ChainFormData & CustomChainPayload = {
      ...data,
      logoURI: data.logoURI || "",
      user: address,
      tokenBridge: JSON.parse(data.tokenBridge),
    };

    let savedChain: CustomChain;

    if (editing) {
      savedChain = await editChain(client, payload);
    }
    else {
      savedChain = await createChain(client, payload);
    };

    setSelectedChain(savedChain)

    navigate({ to: "/" });
  };

  useEffect(() => {
    if (!chainId || editing) return;

    const timeout = setTimeout(() => {
      const validateChainId = async () => {
        let chainExists = false;
        try {
          chainExists = !!chains.filter(
            (x) => x.chainId === Number(chainId)
          )[0];
        } catch {
          // we catch it if no chain exist
        }

        if (chainExists) {
          setError("chainId", {
            type: "manual",
            message: "Chain already exists",
          });
        } else {
          clearErrors("chainId");
        }
      };

      validateChainId();
    }, 400);
    return () => clearTimeout(timeout);
  }, [chainId, address, editing, setError, clearErrors]);

  return (
    <section className="max-w-xl mx-auto">
      <div className="flex flex-col items-start mb-4">
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-sm text-neutral-500 hover:text-neutral-700 flex items-center gap-1 mr-4 mb-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <h1 className="text-2xl text-black text-left">
          {editing ? "Edit" : "Add"} Chain
        </h1>
      </div>

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

      {Object.keys(errors).length > 0 && (
        <div className="mt-8 w-full flex flex-col gap-4">
          {Object.keys(errors).map((key) => (
            <p key={key} className="text-sm text-red-500">{`${key}: ${errors[key as keyof ChainFormData]?.message}`}</p>
          ))}
        </div>
      )}

      {address && (
        <form
          className="mt-8 w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className=" bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
            <div className="mb-6">
              <Input
                disabled={editing}
                name="chainId"
                type="tel"
                label="Chain id"
                placeholder="Chain ID"
                register={register}
                error={errors.chainId?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="name"
                label="Chain name"
                placeholder="Chain name"
                register={register}
                error={errors.name?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="bridge"
                label="Bridge"
                placeholder="Bridge"
                register={register}
                error={errors.bridge?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="inbox"
                label="Inbox"
                placeholder="Inbox"
                register={register}
                error={errors.inbox?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="sequencerInbox"
                label="Sequencer Inbox"
                placeholder="Sequencer Inbox"
                register={register}
                error={errors.sequencerInbox?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="outbox"
                label="Outbox"
                placeholder="Outbox"
                register={register}
                error={errors.outbox?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="rollup"
                label="Rollup"
                placeholder="Rollup"
                register={register}
                error={errors.rollup?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="explorerUrl"
                label="Explorer URL"
                placeholder="Explorer URL"
                register={register}
                error={errors.explorerUrl?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="nativeCurrencyName"
                label="Native Currency Name"
                placeholder="Native Currency Name"
                register={register}
                error={errors.nativeCurrencyName?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="nativeCurrencySymbol"
                label="Native Currency Symbol"
                placeholder="Native Currency Symbol"
                register={register}
                error={errors.nativeCurrencySymbol?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="nativeCurrencyDecimals"
                type="tel"
                label="Native Currency Decimals"
                placeholder="Native Currency Decimals"
                register={register}
                error={errors.nativeCurrencyDecimals?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="publicRpcUrl"
                label="Public RPC URL"
                placeholder="Public RPC URL"
                register={register}
                type="url"
                error={errors.publicRpcUrl?.message}
              />
            </div>
            <div className="mb-6">
              <Input
                name="logoURI"
                label="Logo URI"
                placeholder="Logo URI"
                register={register}
                type="url"
                error={errors.logoURI?.message}
              />
            </div>
            <div className="mb-6">
              <Checkbox
                name="isTestnet"
                label="Is Testnet"
                register={register}
              />
            </div>
            <div className="mb-6">
              <Input
                name="parentChainId"
                label="Parent chain id"
                placeholder="Parent chain id"
                type="tel"
                register={register}
                error={errors.parentChainId?.message}
              />
            </div>
            <div className="mb-6 flex flex-col sm:flex-row w-full gap-4">
              <div className="w-full">
                <label
                  htmlFor="tokenBridge"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Token Bridge (JSON)
                </label>
                <textarea
                  id="tokenBridge"
                  {...register("tokenBridge")}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm font-mono min-h-52 resize-y box-border mt-2"
                />
                {errors.tokenBridge && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.tokenBridge.message}
                  </p>
                )}
              </div>

              <div className="w-full max-w-sm flex flex-col gap-2 h-full">
                <p className="text-sm text-gray-600">
                  Below is the expected structure.
                  <br />
                  All fields are required.
                </p>
                <div className="rounded-lg bg-neutral-900 text-white text-xs max-h-52 overflow-y-auto p-3">
                  <pre className="whitespace-pre-wrap leading-relaxed text-left">
                    {`{
  "parentCustomGateway": string,
  "parentErc20Gateway": string,
  "parentGatewayRouter": string,
  "parentMultiCall": string,
  "parentProxyAdmin": string,
  "parentWeth": string,
  "parentWethGateway": string,
  "childCustomGateway": string,
  "childErc20Gateway": string,
  "childGatewayRouter": string,
  "childMultiCall": string,
  "childProxyAdmin": string,
  "childWeth": string,
  "childWethGateway": string
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || !!errors.chainId}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      )}
    </section>
  );
};
