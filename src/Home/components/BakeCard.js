import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { styled } from "@mui/system";

import PriceInput from "../../components/PriceInput";

const CardWrapper = styled(Card)({
  background: "rgb(251 241 225)",
  marginBottom: 24,
});

export default function BakeCard() {
  return (
    <CardWrapper>
      <CardContent>
        <Grid paddingTop={3} container justifyContent="space-between">
          <Grid item textAlign="center">
            <Typography variant="body1" gutterBottom>
              Contract
            </Typography>
            <Typography variant="h5">0,000.00 BNB</Typography>
          </Grid>
          <Grid item textAlign="center">
            <Typography variant="body1" gutterBottom>
              Wallet
            </Typography>
            <Typography variant="h5">0,000.00 BNB</Typography>
          </Grid>
        </Grid>
        <Box paddingX={3} paddingTop={4} paddingBottom={3}>
          <Box>
            <PriceInput />
          </Box>
          <Box marginY={3}>
            <Button variant="contained" fullWidth>
              BAKE 342,308,23 BEANS
            </Button>
          </Box>
          <Grid container>
            <Grid item flexGrow={1} marginRight={1}>
              <Button variant="contained" color="secondary" fullWidth>
                RE-BAKE
              </Button>
            </Grid>
            <Grid item flexGrow={1} marginLeft={1}>
              <Button variant="contained" color="secondary" fullWidth>
                EAT BEANS
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </CardWrapper>
  );
}
