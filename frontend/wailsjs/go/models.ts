export namespace struct { InputFile string "json:\"input_file\""; Format string "json:\"format\"" } {
	
	export class  {
	    input_file: string;
	    format: string;
	
	    static createFrom(source: any = {}) {
	        return new (source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.input_file = source["input_file"];
	        this.format = source["format"];
	    }
	}

}

