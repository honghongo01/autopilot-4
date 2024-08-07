export function extractCodeName(testDescriptions: string) {
    const result = testDescriptions.split(/(\s+)/).filter(str => /^@/.test(str)).map(str => str.replace(/@/, ""));
    return result;
}