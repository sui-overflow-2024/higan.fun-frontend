import axios from 'axios';
import {NewTokenRequest, Token} from "@/lib/types";

const createCoin = async (token: NewTokenRequest) => {
  const response = await axios.post('http://localhost:3000/coin', {
        ...token
  });
  console.log(response.data);
};

createCoin({
    name: 'Test Coin',
    symbol: 'TST',
    iconUrl: 'https://example.com/icon.png',
    description: 'This is a test coin',
    creator: "",
    signature: "",
    decimals: 0,
    discordUrl: "",
    telegramUrl: "",
    twitterUrl: "",
    website: "http://example.com"
});