import { ApiAiClient } from 'api-ai-javascript';
import { applyMiddleware, createStore } from 'redux';

const accessToken = '8f0dc3185a8b4b3aa61cf1c7018d9625';
const client = new ApiAiClient({accessToken});

const ON_MESAGE = 'ON_MESAGE';

export const sendMessage = (text, sender='user') => ({
	type: ON_MESAGE,
	payload: {text, sender}
});

const messageMiddleware = () => next => action => {
	next(action);

	if (action.type === ON_MESAGE) {
		const { text } = action.payload;

		client.textRequest(text)
			.then( onSuccess )

		function onSuccess (response) {
			const {result: {fulfillment }} = response;
			next(sendMessage(fulfillment.speech, 'bot'));
		}
	}
};


const messageReducer = (state = [], action) => {
	switch (action.type) {
		case ON_MESAGE:
			return [ ...state, action.payload ];
		default:
			return state;
	}
};

export const store = createStore(messageReducer, applyMiddleware(messageMiddleware));
