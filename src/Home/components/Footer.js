import Grid from "@mui/material/Grid";
import esIcon from "../assets/ESIcon.png";
import tgIcon from "../assets/TGIcon.png";
import twIcon from "../assets/TWIcon.png";

export default function Footer() {
  return (
    <Grid container justifyContent="center" spacing={2} marginTop={4}>
      <Grid item>
        <img src={esIcon} alt="" width={48} height={48} />
      </Grid>
      <Grid item>
        <img src={tgIcon} alt="" width={48} height={48} />
      </Grid>
      <Grid item>
        <img src={twIcon} alt="" width={48} height={48} />
      </Grid>
    </Grid>
  );
}
