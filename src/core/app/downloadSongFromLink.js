import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';


export default function downloadSongFromLink(link, name) {
    let cached = toast.loading("Downloading your song...", { position: "top-right" });
    fetch(link).then(response => {
        const totalBytes = Number(response.headers.get('Content-Length'));
        let downloadedBytes = 0;

        const progressCallback = (chunk) => {
            downloadedBytes += chunk.length;
            const progress = (downloadedBytes / totalBytes) * 100;
            cached = toast.loading(`Download progress: ${progress.toFixed(0)}%`, { id: cached });
        };

        const reader = response.body.getReader();

        return new ReadableStream({
            start(controller) {
                function pump() {
                    return reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        progressCallback(value);
                        return pump();
                    });
                }
                return pump();
            }
        });
    })
        .then(stream => new Response(stream))
        .then(response => response.blob())
        .then(blob => saveAs(blob, name))
        .then(() => {
            toast.success("Song downloaded successfully.", { id: cached });
        })
        .catch(error => {
            toast.error("Failed to download this song. Please try again.", { id: cached });
            console.error(error);
        });
}
