import isofetch from 'isomorphic-fetch';

export default {
	async fetch(){
		return await isofetch.apply(null,arguments);
	}
}