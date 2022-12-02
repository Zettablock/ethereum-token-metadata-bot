const sdk = require('api')('@zettablock/v0.3.4#14g2en2alaj472z9')

sdk
	.postDatasetIdGraphql(
		{
			query:
				'{   records(symbol:"UNI",limit:1){ 		price     decimals     ethereum_token_address     symbol     slug     minute     data_creation_date   } }',
		},
		{
			id: 'sq_bce0000af5014d96ac0995578cd7a403',
			'x-api-key': '331260f6-f3ce-4596-9ab4-d7ebd581be22',
		}
	)
	.then(({ data }) => console.log(data))
	.catch((err) => console.error(err))
