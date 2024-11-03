export namespace config {
	
	export class ImageConfig {
	    image_dir: string;
	
	    static createFrom(source: any = {}) {
	        return new ImageConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.image_dir = source["image_dir"];
	    }
	}

}

