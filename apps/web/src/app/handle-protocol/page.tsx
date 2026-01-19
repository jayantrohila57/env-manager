import { Suspense } from "react";
import ProtocolHandlerClient from "./protocol-handler-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ProtocolHandlerClient />
    </Suspense>
  );
}
