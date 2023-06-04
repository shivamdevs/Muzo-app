import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';


export default function downloadSongFromLink(link, name) {
    const cached = toast.loading("Downloading your song...");
    fetch(link).then(response => response.blob()).then(blob => saveAs(blob, name)).then(() => {
        toast.success("Song downloaded successfully.", { id: cached });
    }).catch(error => {
        toast.error("Failed to download this song. Please try again.", { id: cached });
        console.error(error);
    });
}
