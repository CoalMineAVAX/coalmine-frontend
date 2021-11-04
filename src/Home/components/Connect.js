import Button from "@mui/material/Button";
import { styled } from "@mui/system";

import { useAuthContext } from "../../providers/AuthProvider";

const ConnectButton = styled(Button)(({ theme }) => ({
  position: "fixed",
  right: 48,
  top: 48,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

export default function Connect({ responsive = true }) {
  const { address, loading, connect, disconnect } = useAuthContext();

  return responsive ? (
    <ConnectButton
      color="secondary"
      variant="contained"
      disabled={loading}
      onClick={() => (address ? disconnect() : connect())}
    >
      {address ? "Disconnect" : "Connect"}
    </ConnectButton>
  ) : (
    <Button
      style={{ marginTop: -24, marginBottom: 24, width: "100%" }}
      color="secondary"
      variant="contained"
      disabled={loading}
      onClick={() => (address ? disconnect() : connect())}
    >
      {address ? "Disconnect" : "Connect"}
    </Button>
  );
}
