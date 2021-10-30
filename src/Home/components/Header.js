import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import logo from "../../assets/FullLogo.png";

const Wrapper = styled("div")({
  textAlign: "center",
  paddingBottom: 24,
});

export default function Header() {
  return (
    <Wrapper>
      <img src={logo} alt="" width={"100%"} style={{ marginTop: -48 }} />
      <Typography variant="h4" marginTop={-6} marginX="-90px">
        The BNB Miner with the yummiest daily return and lowest dev fee
      </Typography>
    </Wrapper>
  );
}
