"use client";

import EthereumLogin from "./wallet/EthereumLogin";
import StarkLogin from "./wallet/StarkLogin";
import { Button } from "./ui/button";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  useConnectors,
  useAccount as useL2Account,
  useNetwork,
} from "@starknet-react/core";
import { useAccount as useL1Account } from "wagmi";
import { shortenHex } from "@/functions/utils";

import { Account } from "../bridge/Account";
import Link from "next/link";
import { Compass, Menu } from "lucide-react";
import { useUIContext } from "../providers/UIProvider";
import { Tabs } from "@/app/components/Tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import Image from "next/image";

export const TopNav = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);
  const { address: l1Address, isConnected } = useL1Account();
  const { address: l2Address, isConnected: isL2Connected } = useL2Account();
  const { chain } = useNetwork();
  const { disconnect } = useConnectors();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setIsDefinitelyConnected(true);
    } else {
      setIsDefinitelyConnected(false);
    }
  }, [l1Address]);

  const onDisconnect = () => {
    setIsWrongNetwork(false);
    disconnect();
  };

  const { toggleSidebar } = useUIContext();
  const network =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "goerli" : "mainnet";

  const NETWORK_ID = {
    mainnet: "0x534e5f4d41494e",
    goerli: "0x534e5f474f45524c49",
  };

  useEffect(() => {
    if (isL2Connected) {
      if (
        (chain?.id === NETWORK_ID.goerli && network === "mainnet") ||
        (chain?.id === NETWORK_ID.mainnet && network === "goerli")
      ) {
        setIsWrongNetwork(true);
      } else {
        setIsWrongNetwork(false);
      }
    }
  }, [chain?.id, l2Address, isL2Connected]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 0);
  });

  const tabs = [
    {
      name: "Mainnet",
      content: <Account isL1={true} />,
    },

    {
      name: "Starknet",
      content: <Account isL1={false} />,
    },
  ];

  return (
    <div
      id="topnav"
      className={`fixed w-full p-3 pl-4 sm:pl-8 lg:pl-32 z-[100] ${
        isScrolled ? "backdrop-blur-sm" : ""
      }`}
    >
      <div className="flex justify-between sm:justify-end ">
        <Button className={"flex sm:hidden"} onClick={toggleSidebar}>
          <Menu className="w-8" />
        </Button>

        <Link
          className="flex sm:hidden self-center text-xl font-semibold  sm:text-2xl font-sans-serif "
          href="/"
        >
          <Compass className="self-center w-12 h-8 pl-3 transition-all duration-500" />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex space-x-2">
              <Button variant={"outline"} className="flex gap-x-2">
                {l1Address && isDefinitelyConnected ? (
                  <>
                    <Image
                      width={13}
                      height={13}
                      className="mr-2"
                      src="/icons/ethereum.svg"
                      alt="ethereum"
                    />
                    {shortenHex(l1Address)}
                  </>
                ) : (
                  <span className="flex">
                    <Image
                      width={13}
                      height={13}
                      className="mr-2"
                      src="/icons/ethereum.svg"
                      alt="ethereum"
                    />
                    Connect
                  </span>
                )}
              </Button>
              <Button variant={"outline"} className="flex gap-x-2">
                {l2Address && isConnected ? (
                  <>
                    <Image
                      width={20}
                      height={20}
                      className="mr-2"
                      src="/icons/starknet.svg"
                      alt="starknet"
                    />
                    {shortenHex(l2Address)}
                  </>
                ) : (
                  <span className="flex">
                    <Image
                      width={20}
                      height={20}
                      className="mr-2"
                      src="/icons/starknet.svg"
                      alt="ethereum"
                    />
                    Connect
                  </span>
                )}
              </Button>
            </div>
          </SheetTrigger>
          <SheetContent position={"right"} size={"lg"}>
            <div className="flex-col gap-y-4 flex w-full mt-8 h-auto">
              <EthereumLogin />
              <StarkLogin />
              <Tabs tabs={tabs} />
            </div>
          </SheetContent>
        </Sheet>

        {isWrongNetwork && (
          <Dialog open={isWrongNetwork}>
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>Wrong Network</DialogTitle>
              </DialogHeader>
              <span>
                The Atlas currently only supports{" "}
                <span className="capitalize">{network}</span>, please change the
                connected network in your Starknet wallet, or:
              </span>
              <Button
                variant={"default"}
                size={"lg"}
                className="mt-4"
                onClick={() => onDisconnect()}
              >
                Disconnect
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
