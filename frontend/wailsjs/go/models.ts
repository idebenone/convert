export namespace struct { InputFile string; Format string } {
	
	export class  {
	    InputFile: string;
	    Format: string;
	
	    static createFrom(source: any = {}) {
	        return new (source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.InputFile = source["InputFile"];
	        this.Format = source["Format"];
	    }
	}

}

