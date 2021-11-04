/* eslint-disable react-hooks/exhaustive-deps */
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";

import PriceInput from "../../components/PriceInput";
import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import { config } from "../../config";
import Web3 from "web3";

const CardWrapper = styled(Card)({
  background: "rgb(251 241 225)",
  marginBottom: 24,
});

let timeout = null;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function BakeCard() {
  const { contract, wrongNetwork, getBnbBalance, fromWei, toWei, web3 } =
    useContractContext();
  const { address } = useAuthContext();
  const [contractBNB, setContractBNB] = useState(0);
  const [walletBNB, setWalletBNB] = useState(0);
  const [bakeBNB, setBakeBNB] = useState(0);
  const [calculatedBeans, setCalculatedBeans] = useState(0);
  const [loading, setLoading] = useState(false);
  const query = useQuery();

  const fetchContractBNBBalance = () => {
    if (!web3 || wrongNetwork) {
      setContractBNB(0);
      return;
    }
    getBnbBalance(config.contractAddress).then((amount) => {
      setContractBNB(fromWei(amount));
    });
  };

  const fetchWalletBNBBalance = () => {
    if (!web3 || wrongNetwork || !address) {
      setWalletBNB(0);
      return;
    }
    getBnbBalance(address).then((amount) => {
      setWalletBNB(fromWei(amount));
    });
  };

  useEffect(() => {
    fetchContractBNBBalance();
  }, [web3]);

  useEffect(() => {
    fetchWalletBNBBalance();
  }, [address, web3]);

  const onUpdateBakeBNB = (value) => {
    setBakeBNB(value);

    if (wrongNetwork || !address || !web3 || !value) {
      setCalculatedBeans(0);
      return;
    }

    clearTimeout(timeout);

    setTimeout(() => {
      contract.methods
        .calculateBeanBuySimple(toWei(`${value}`))
        .call()
        .then(setCalculatedBeans)
        .catch(() => setCalculatedBeans(0));
    }, 800);
  };

  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      : "0x0000000000000000000000000000000000000000";
    return ref;
  };

  const bake = async () => {
    setLoading(true);

    const ref = getRef();

    try {
      await contract.methods.bakeBeans(ref).send({
        from: address,
        value: toWei(`${bakeBNB}`),
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBNBBalance();
    fetchContractBNBBalance();
    setLoading(false);
  };

  const reBake = async () => {
    setLoading(true);

    const ref = getRef();

    try {
      await contract.methods.reBakeBeans(ref).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const eatBeans = async () => {
    setLoading(true);

    try {
      await contract.methods.takeBeans().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBNBBalance();
    fetchContractBNBBalance();
    setLoading(false);
  };

  return (
    <CardWrapper>
      {loading && <LinearProgress color="secondary" />}
      <CardContent>
        <Grid paddingTop={3} container justifyContent="space-around">
          <Grid item textAlign="center">
            <Typography variant="body1" gutterBottom>
              Contract
            </Typography>
            <Typography variant="h5">{contractBNB} BNB</Typography>
          </Grid>
          <Grid item textAlign="center">
            <Typography variant="body1" gutterBottom>
              Wallet
            </Typography>
            <Typography variant="h5">{walletBNB} BNB</Typography>
          </Grid>
        </Grid>
        <Box paddingX={3} paddingTop={4} paddingBottom={3}>
          <Box>
            <PriceInput
              max={+walletBNB}
              value={bakeBNB}
              onChange={(value) => onUpdateBakeBNB(value)}
            />
          </Box>
          <Box marginY={3}>
            <Button
              variant="contained"
              fullWidth
              disabled={wrongNetwork || !address || +bakeBNB === 0 || loading}
              onClick={bake}
            >
              BAKE {calculatedBeans} BEANS
            </Button>
          </Box>
          <Grid container>
            <Grid item flexGrow={1} marginRight={1}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading}
                onClick={reBake}
              >
                RE-BAKE
              </Button>
            </Grid>
            <Grid item flexGrow={1} marginLeft={1}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading}
                onClick={eatBeans}
              >
                EAT BEANS
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </CardWrapper>
  );
}
