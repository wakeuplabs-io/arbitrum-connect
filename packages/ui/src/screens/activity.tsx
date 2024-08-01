import { useState, useEffect } from "react";
import { Transaction, transactionsStorageService } from "@/lib/transactions";
import { Link, useNavigate } from "react-router-dom";
import TopBarLayout from "@/layouts/topbar";
import { ChevronLeftIcon } from "lucide-react";
import { shortenAddress } from "@/lib/shorten-address";

export default function ActivityScreen() {
  const navigate = useNavigate();
  const [txHistory, setTxHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    setTxHistory(transactionsStorageService.getAll());
  }, []);

  return (
    <TopBarLayout>
      <div className="flex flex-col max-w-xl mx-auto">
        <div className="flex space-x-3 items-center mb-8">
          <Link to="/">
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="flex text-xl font-semibold">
            My activity
          </h1>
        </div>

        <div className="flex">
          <ul>
            {txHistory.map((x) => (
              <li key={x.bridgeHash} className="list-disc ml-4">
                {shortenAddress(x.bridgeHash)}{" "}
                <Link
                  className="link"
                  to={`/activity/${x.bridgeHash}`}
                >
                  View detail
                </Link>
              </li>
            ))}
          </ul>

          {/* <ul className="flex flex-col text-left justify-between items-center border border-neutral-200 rounded-2xl p-5">
            {props.txHistory.map((x, i) => (
              <li
                className="collapse collapse-arrow join-item"
                key={`collapsable-${i}`}
              >
                <input type="radio" name="accordion" />
                <div className="collapse-title text-lg flex items-center justify-between after:traslate-y-0">
                  <div className="flex gap-3 items-center">
                    <img src={EthereumIcon} />
                    <div className="">Withdrawal</div>
                  </div>
                  <div className="flex items-center">0.0005 ETH</div>
                </div>
                <div className="collapse-content">
                  <TransactionStatus txHash={x} />
                </div>
              </li>
            ))}
          </ul> */}
        </div>
      </div>
    </TopBarLayout>
  );
}

