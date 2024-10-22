function combineElements(list1, list2) {
    const combinedList = [...list1, ...list2].sort((a, b) => a.positions[0] - b.positions[0]);

    const mergedList = [];

    for (let i = 0; i < combinedList.length; i++) {
        const element = combinedList[i];
        if (mergedList.length === 0) {
            mergedList.push(element);
        } else {
            const lastElement = mergedList[mergedList.length - 1];
            const [left_pos_1, right_pos_1] = lastElement.positions;
            const [left_pos_2, right_pos_2] = element.positions;

            const overlap = Math.min(right_pos_1, right_pos_2) - Math.max(left_pos_1, left_pos_2);
            const len1 = right_pos_1 - left_pos_1;
            const len2 = right_pos_2 - left_pos_2;

            if (overlap > 0 && (overlap >= 0.5 * len1 || overlap >= 0.5 * len2)) {
                lastElement.values.push(...element.values);
                  } else {
                mergedList.push(element); 
            }
        }
    }

    return mergedList;
}
const list1 = [
    { positions: [1, 4], values: [10, 15] },
    { positions: [5, 7], values: [20] }
];

const list2 = [
    { positions: [3, 6], values: [30] },
    { positions: [8, 10], values: [40] }
];

const mergedResult = combineElements(list1, list2);
console.log(mergedResult);
