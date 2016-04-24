interface AzureMediaPlayer {
    (id: string, options: {}): any;
}

declare module "amp" {
    export = amp;
}

declare var amp: AzureMediaPlayer;