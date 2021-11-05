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
import Web3 from "web3";

import PriceInput from "../../components/PriceInput";
import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";
import { config } from "../../config";

const CardWrapper = styled(Card)({
  background: "rgb(251 241 225)",
  marginBottom: 24,
});

const ButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "> div": {
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

let timeout = null;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function BakeCard() {
  const { contract, wrongNetwork, getBnbBalance, fromWei, toWei, web3 } =
    useContractContext();
  const { address, chainId } = useAuthContext();
  const [contractBNB, setContractBNB] = useState(0);
  const [walletBalance, setWalletBalance] = useState({
    bnb: 0,
    beans: 0,
  });
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

  const fetchWalletBalance = async () => {
    if (!web3 || wrongNetwork || !address) {
      setWalletBalance({
        bnb: 0,
        beans: 0,
      });
      return;
    }

    try {
      const [bnbAmount, beansAmount] = await Promise.all([
        getBnbBalance(address),
        contract.methods.getMyMiners(address).call(),
      ]);
      setWalletBalance({
        bnb: fromWei(`${bnbAmount}`),
        beans: fromWei(`${beansAmount}`),
      });
    } catch (err) {
      console.error(err);
      setWalletBalance({
        bnb: 0,
        beans: 0,
      });
    }
  };

  useEffect(() => {
    fetchContractBNBBalance();
  }, [web3, chainId]);

  useEffect(() => {
    fetchWalletBalance();
  }, [address, web3, chainId]);

  const onUpdateBakeBNB = (value) => {
    setBakeBNB(value);

    if (wrongNetwork || !address || !web3 || !value) {
      setCalculatedBeans(0);
      return;
    }

    clearTimeout(timeout);

    setTimeout(() => {
      contract.methods
        .calculateEggBuy(toWei(`${value}`), toWei(`${contractBNB}`))
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
      await contract.methods.buyEggs(ref).send({
        from: address,
        value: toWei(`${bakeBNB}`),
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBNBBalance();
    setLoading(false);
  };

  const reBake = async () => {
    setLoading(true);

    const ref = getRef();

    try {
      await contract.methods.hatchEggs(ref).send({
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
      await contract.methods.sellEggs().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBNBBalance();
    setLoading(false);
  };

  return (
    <CardWrapper>
      {loading && <LinearProgress color="secondary" />}
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Contract</Typography>
          <Typography variant="h5">{contractBNB} BNB</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Wallet</Typography>
          <Typography variant="h5">{walletBalance.bnb} BNB</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1">Your Beans</Typography>
          <Typography variant="h5">{walletBalance.beans} BEANS</Typography>
        </Grid>
        <Box paddingTop={4} paddingBottom={3}>
          <Box>
            <PriceInput
              max={+walletBalance.bnb}
              value={bakeBNB}
              onChange={(value) => onUpdateBakeBNB(value)}
            />
          </Box>
          <Box marginTop={3}>
            <Button
              variant="contained"
              fullWidth
              disabled={wrongNetwork || !address || +bakeBNB === 0 || loading}
              onClick={bake}
            >
              BAKE BEANS
            </Button>
          </Box>
          <ButtonContainer container>
            <Grid item flexGrow={1} marginRight={1} marginTop={3}>
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
            <Grid item flexGrow={1} marginLeft={1} marginTop={3}>
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
          </ButtonContainer>
        </Box>
      </CardContent>
    </CardWrapper>
  );
}
