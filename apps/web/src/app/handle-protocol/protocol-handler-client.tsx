"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ProtocolHandlerClient() {
  const searchParams = useSearchParams();
  const protocol = searchParams.get("protocol");

  useEffect(() => {
    if (!protocol) return;

    console.log("Handling protocol:", protocol);
    const url = new URL(protocol);

    if (protocol.includes("web+env")) {
      handleEnvProtocol(url);
    } else if (protocol.includes("web+config")) {
      handleConfigProtocol(url);
    }

    window.location.href = "/";
  }, [protocol]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-2xl">Protocol Handler</h1>
        <p className="mb-4 text-gray-600">
          {protocol
            ? `Handling protocol: ${protocol}`
            : "No protocol specified"}
        </p>
        <p className="text-gray-500 text-sm">Redirecting to app...</p>
      </div>
    </div>
  );
}

function handleEnvProtocol(url: URL) {
  localStorage.setItem("protocol_project", url.hostname);
  localStorage.setItem("protocol_env", url.pathname.replace("/", ""));
}

function handleConfigProtocol(url: URL) {
  const action = url.pathname.replace("/", "");
  localStorage.setItem(`config_${action}`, "true");
}
