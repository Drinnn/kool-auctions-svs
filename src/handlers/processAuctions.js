import errors from 'http-errors';
import getEndedAuctions from '../lib/getEndedAuctions';
import closeAuction from '../lib/closeAuction';

async function processAuctions(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closedAuctionsPromises = auctionsToClose.map((auction) =>
      closeAuction(auction)
    );
    await Promise.all(closedAuctionsPromises);

    return { closed: closedAuctionsPromises.length };
  } catch (err) {
    console.error(err);
    throw new errors.InternalServerError(err);
  }
}

export const handler = processAuctions;
