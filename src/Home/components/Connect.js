import Button from "@mui/material/Button";
import { styled } from "@mui/system";

import { useAuthContext } from "../../providers/AuthProvider";

const ConnectButton = styled(Button)({
  position: "fixed",
  right: 48,
  top: 48,
});

export default function Connect() {
  const { address, loading, connect, disconnect } = useAuthContext();

  return (
    <ConnectButton
      color="secondary"
      variant="contained"
      disabled={loading}
      onClick={() => (address ? disconnect() : connect())}
    >
      {address ? "Disconnect" : "Connect"}
    </ConnectButton>
  );
}
