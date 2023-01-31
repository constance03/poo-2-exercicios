// id TEXT PRIMARY KEY UNIQUE NOT NULL, 
// title TEXT NOT NULL,
// duration NUMBER NOT NULL,
// created_at TEXT DEFAULT (DATETIME()) NOT NULL

export class Video {
    constructor (
        private id: string,
        private title: string,
        private duration: number,
        private createdAt: string
    ) {}

    public getCreatedAt(): string {
        return this.createdAt;
    }
    public setCreatedAt(value: string) {
        this.createdAt = value;
    }
    public getDuration(): number {
        return this.duration;
    }
    public setDuration(value: number) {
        this.duration = value;
    }
    public getTitle(): string {
        return this.title;
    }
    public setTitle(value: string) {
        this.title = value;
    }
    public getId(): string {
        return this.id;
    }
    public setId(value: string) {
        this.id = value;
    }

}