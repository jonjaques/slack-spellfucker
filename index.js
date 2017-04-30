const express = require('express')
const spellfucker = require('spellfucker')
const bodyParser = require('body-parser')
const compression = require('compression')

const app = express()

app.use(compression())
app.use(bodyParser.urlencoded())

app.post('/commands/:command', (req, res)=> {
  const command = req.params.command
  switch(command) {
  	case 'spellfucker':
  		return spellfuckerCommand(req, res)
  		break;
  	default:
  		return res.sendStatus(404)
  		break;
  }
})


function spellfuckerCommand(req, res) {
	let ratings = []
	let text = req.body.text
	let type = 'ephemeral'

	if (text === 'help') {
		return res.json({
			response_type: type,
			text: 'Simply input a message... To post to the channel, start your message with "channel" followed by a space.'
		})
	}

	if (text.startsWith('channel')) {
		type = 'in_channel'
		text = text.slice(8)
	}
	
	let words = text.split(' ')
	
	let newText = words.map(word => {
	  if (word.startsWith('@') || word.startsWith('#') || word === ' ') {
	  	return word
	  }
	  let fucked = spellfucker(word)
	  ratings.push(fucked.rating)
	  return fucked.result
	}).join(' ')

	let ratingSum = ratings.reduce((m, rating)=> {
		let n = parseInt(rating.replace('%', ''), 10)
		m = m + n
		return m
	}, 0)
	
	let rating = ratingSum / ratings.length
	
	res.json({
	  response_type: type,
	  text: newText,
	  attachments: [
	  	{text: `Rating: ${rating.toFixed(2)}%`}
	  ]
	})
}

const port = process.env.PORT || 3000
app.listen(port, ()=> {
	console.log(`app listening on ${port}`)
})