import fs from 'fs/promises';
import path from 'path';

async function main() {
    // Make sure folders exist
    await fs.mkdir('api/average', { recursive: true });
    await fs.mkdir('api/single', { recursive: true });

    const eventRanks = {
        single: {
            "222": {}, "333": {}, "333bf": {}, "333fm": {}, "333mbf": {}, "333mbo": {}, "333oh": {}, "333ft": {},
            "444": {}, "444bf": {}, "555": {}, "555bf": {}, "666": {}, "777": {},
            "clock": {}, "magic": {}, "mmagic": {}, "minx": {}, "pyram": {}, "skewb": {}, "sq1": {}
        },
        average: {
            "222": {}, "333": {}, "333bf": {}, "333fm": {}, "333mbf": {}, "333mbo": {}, "333oh": {}, "333ft": {},
            "444": {}, "444bf": {}, "555": {}, "555bf": {}, "666": {}, "777": {},
            "clock": {}, "magic": {}, "mmagic": {}, "minx": {}, "pyram": {}, "skewb": {}, "sq1": {}
        }
    };

    const firstRes = await fetch('https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons-page-1.json');
    const firstJson = await firstRes.json();
    const totalPages = Math.ceil(firstJson.total / 1000);

    for (let page = 1; page <= totalPages; page++) {
        console.log(page);
        const res = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons-page-${page}.json`);
        const json = await res.json();
        json.items.forEach(person => {
            person.rank.averages.forEach(average => {
                const eventId = average.eventId;
                const rank = average.rank.world;
                const time = average.best;

                if (rank in eventRanks.average[eventId]) {
                    eventRanks.average[eventId][rank].ids.push(person.id);
                } else {
                    eventRanks.average[eventId][rank] = {
                        ids: [person.id],
                        time: time
                    };
                }
            });

            person.rank.singles.forEach(single => {
                const eventId = single.eventId;
                const rank = single.rank.world;
                const time = single.best;
                if (rank in eventRanks.single[eventId]) {
                    eventRanks.single[eventId][rank].ids.push(person);
                } else {
                    eventRanks.single[eventId][rank] = {
                        ids: [person.name],
                        time: time
                    };
                }
            });
        });
    }
    

    // Write average rankings
    for (const [eventId, rankings] of Object.entries(eventRanks.average)) {
    const filePath = path.join('api', 'average', `${eventId}.json`);
    await fs.writeFile(filePath, JSON.stringify(rankings, null, 2));
    }

    // Write single rankings
    for (const [eventId, rankings] of Object.entries(eventRanks.single)) {
    const filePath = path.join('api', 'single', `${eventId}.json`);
    await fs.writeFile(filePath, JSON.stringify(rankings, null, 2));
    }
}

main().catch(err => {
  console.error('❌ Test setup failed:', err);
  process.exit(1);
});