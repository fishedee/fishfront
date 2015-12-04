import adler32 from 'adler-32';

export default function(input){
	var result = adler32.str(input);
	return parseInt(result,10).toString(16);
}