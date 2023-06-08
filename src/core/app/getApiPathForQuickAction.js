export default function getApiPathForQuickAction(type) {
    if (type === 'song') return 'songs';
    if (type === 'playlist') return 'playlists';
    if (type === 'album') return 'albums';
    if (type === 'artist') return 'artists';
    console.log(type);
    return type;
}