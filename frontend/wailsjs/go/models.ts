export namespace domain {
	
	export class PomodoroSession {
	    ID: number;
	    StartTime: string;
	    Duration: number;
	    Break: number;
	    Status: string;
	
	    static createFrom(source: any = {}) {
	        return new PomodoroSession(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.StartTime = source["StartTime"];
	        this.Duration = source["Duration"];
	        this.Break = source["Break"];
	        this.Status = source["Status"];
	    }
	}

}

