import { parseString } from 'xml2js';

export async function parseXml<T>(xml: string): Promise<T> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result: T) => {
      if (err) {
        console.error('Error parsing XML:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export function isToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString();
}

export function removeDuplicates<T>(items: T[], key: keyof T): T[] {
  return items.filter(
    (item, index, self) => index === self.findIndex((i) => i[key] === item[key])
  );
}
