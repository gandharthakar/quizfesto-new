export const GFG = (array: any, currPage: number, pageSize: number): any[] => {
    const startIndex = (currPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return array.slice(startIndex, endIndex);
}

export const shuffle_array = (array: any[]): any[] => {
    /* eslint-disable no-unused-vars */
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const getClassOfTimeTaken = (qet: string, qttby: string): string => {
    let className = '';
    if (qttby < qet) {
        className = 'text-green-600';
    } else {
        if (qet === qttby) {
            className = '';
        } else {
            className = 'text-red-600';
        }
    }
    return className;
}