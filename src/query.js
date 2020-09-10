import axios from 'axios';
import DateFns from 'date-fns';
const { format, addDays, eachDayOfInterval } = DateFns;

const noons = {
  1: '早上',
  2: '下午',
  3: '晚上',
};

const noonMap = new Map([
  [1, 1],
  [2, 3],
  [3, 1],
  [4, 3],
  [5, 3],
  [6, [1, 2]],
]);

async function findSpace(date, noon) {
  try {
    const res = await axios.get('https://www.tmh.org.tw/TMH2016/RegDr.aspx', {
      params: {
        Kind: '2',
        Dept: 'CC',
        Sect: 1227,
        Date: date,
        Noon: noon,
      },
    });
    return {
      date,
      noon,
      hasSpace: res.data.includes('ctl00_ContentPlaceHolder1_TB_ID'),
    };
  } catch (e) {
    return {
      date,
      noon,
      hasSpace: false,
    };
  }
}

async function main() {
  const start = new Date();
  const end = addDays(new Date(), 29);
  const dates = eachDayOfInterval({ start, end })
    .filter((date) => date.getDay() > 0)
    .reduce((result, date) => {
      const formattedDate = format(date, 'yyyy/MM/dd');
      const noon = noonMap.get(date.getDay());
      if (Array.isArray(noon)) {
        noon.forEach((n) => {
          result.push([formattedDate, n]);
        });
      } else {
        result.push([formattedDate, noon]);
      }
      return result;
    }, [])
    .map(([date, noon]) => {
      return findSpace(date, noon);
    });
  const data = await Promise.all(dates)
    .then((values) => values.filter(({ hasSpace }) => hasSpace))
    .then((values) => {
      return values.map(({ date, noon }) => {
        const link = new URL('https://www.tmh.org.tw/TMH2016/RegDr.aspx');
        link.searchParams.append('Kind', '2');
        link.searchParams.append('Dept', 'CC');
        link.searchParams.append('Sect', 1227);
        link.searchParams.append('Date', date);
        link.searchParams.append('Noon', noon);
        return {
          date,
          noon: noons[noon],
          href: link.href,
        };
      });
    });
  return data;
}

export default main;
