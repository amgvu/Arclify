import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchServers } from "@/lib/utilities";
import { Server } from "@/types/types";

export const useServers = () => {
  const { data: session } = useSession();
  const [servers, setServers] = useState<Server[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getServers = async () => {
      if (session?.accessToken && session.user?.discordId) {
        const cachedServers = localStorage.getItem("cachedServers");
        const cachedTimestamp = localStorage.getItem("serversTimestamp");

        const pageLoadTimestamp = sessionStorage.getItem("pageLoadTimestamp");
        const isCacheValid =
          cachedServers &&
          cachedTimestamp &&
          pageLoadTimestamp &&
          cachedTimestamp > pageLoadTimestamp;

        if (isCacheValid) {
          try {
            const parsedServers = JSON.parse(cachedServers);
            setServers(parsedServers);
            return;
          } catch (err) {
            console.error("Failed to parse cached servers", err);
          }
        }

        try {
          const data = await fetchServers(
            session.accessToken,
            session.user.discordId
          );
          setServers(data);

          localStorage.setItem("cachedServers", JSON.stringify(data));
          localStorage.setItem("serversTimestamp", Date.now().toString());
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Failed to fetch servers"
          );
        }
      }
    };

    if (!sessionStorage.getItem("pageLoadTimestamp")) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      sessionStorage.getItem("pageLoadTimestamp") ||
        sessionStorage.setItem("pageLoadTimestamp", Date.now().toString());
    }

    if (session) {
      const timeoutId = setTimeout(() => {
        getServers();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [session]);

  return { servers, error };
};
