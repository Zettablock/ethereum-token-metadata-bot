require('dotenv').config()
const axios = require('axios')
const TelegramBot = require('node-telegram-bot-api')

// Modify the API_ID BOT_TOKEN and X_API_KEY in .env file
const API_ID = process.env.API_ID // Zettablock API ID
const BOT_TOKEN = process.env.BOT_TOKEN // Your Telegram Bot Token
const X_API_KEY = process.env.X_API_KEY // Your Zettablock API Key

const bot = new TelegramBot(BOT_TOKEN, { polling: true }) // Create a bot that uses 'polling' to fetch new updates

// Get token data from Zettablock API
async function queryToken(symbol) {
	var result
	const options = {
		method: 'POST',
		url: `https://api.zettablock.com/api/v1/dataset/${API_ID}/graphql`, // Zettablock API endpoint
		headers: {
			accept: 'application/json',
			'X-API-KEY': X_API_KEY, // Your ZettaBlock API Key
			'content-type': 'application/json',
		},
		data: {
			// GraphQL query starts here, token symbol is passed as a variable
			query: `
				{
					records(symbol: "${symbol}", limit: 1 )
					{
						price
						decimals
						ethereum_token_address
						symbol
						slug
						minute
						data_creation_date
					}
				}
			`,
			// GraphQL query ends here
		},
	}

	await axios
		.request(options) // Send the request to Zettablock API
		.then(function (response) {
			// If the request is successful, return the data
			// console.log(response.data.data.records)
			result = response.data.data.records
		})
		.catch(function (error) {
			// If the request is failed, return the error
			console.error(error)
		})
	// return the result array
	return result
}

// Listen for '/token' command
bot.onText(/\/token/, async (msg) => {
	const chatId = msg.chat.id // Get the chat ID from the message
	const symbol = msg.text.split(' ')[1] // Get the token symbol from the message

	// Query the token data
	var data = await queryToken(symbol)

	// data[0] is the first element of the array, which is the latest record
	// data.length == 0 means the token is not found
	if (data.length == 0) {
		// If the token is not found, send a message
		bot.sendMessage(chatId, 'Token not found')
		return
	} else {
		data = data[0]
	}

	// send token data
	const replyMsg = `
    🪙 Ethereum Token Data:
    - Ethereum Token Address: ${data.ethereum_token_address}
    - Token: ${data.symbol}
    - Slug: ${data.slug}
    - Decimals: ${data.decimals}
    - Data Creation Date: ${data.data_creation_date}
	- Price: ${data.price}
	- Time: ${data.minute}

    Power by Zettablock.com
`
	bot.sendMessage(chatId, replyMsg) // Send the message to the chat
})
