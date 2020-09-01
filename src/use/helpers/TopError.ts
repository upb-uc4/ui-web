import Error from "@/api/api_models/errors/Error";
import { nextTick } from "vue";

export default async function scrollToTopError(errors: Error[]) {
    await nextTick();
    const elements = document.getElementsByTagName("p");
    const errMessages: HTMLParagraphElement[] = [];

    errors.forEach((err) => {
        for (let item of elements) {
            if (item.textContent == err.reason) {
                console.log(err.name + " : " + item.getBoundingClientRect().top);
                errMessages.push(item);
            }
        }
    });

    errMessages.sort((a, b) => {
        if (a.getBoundingClientRect().top < b.getBoundingClientRect().top) {
            return -1;
        }
        if (a.getBoundingClientRect().top > b.getBoundingClientRect().top) {
            return 1;
        }
        return 0;
    });

    if (errMessages[0].previousSibling) {
        const input = errMessages[0].previousSibling as HTMLElement;
        if (input.classList.contains("error")) {
            return input.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    return errMessages[0].scrollIntoView({ behavior: "smooth", block: "start" });
}
