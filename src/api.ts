/* eslint-disable no-new-func */
import express from 'express';

const router = express.Router();

// List of counters route
router.get('/counters', (req: express.Request, res: express.Response) => {
  res.json({
    response: Object.keys(global.resultObject.counters).slice(0, -4)
  });
});

// Single counter route
router.get(
  '/counters/:counter',
  (req: express.Request, res: express.Response) => {
    const { counter } = req.params;
    if (Object.keys(global.resultObject.counters).includes(counter)) {
      if (
        Object.keys(global.resultObject.counters[counter]).includes('types')
      ) {
        res.json({
          response: {
            this_year: Function(
              global.resultObject.counters[counter].this_year_formula
            )(),
            today: Function(
              global.resultObject.counters[counter].today_formula
            )()
          }
        });
      } else {
        const counterFunction = Function(
          global.resultObject.counters[counter].formula
        );
        res.json({ response: counterFunction() });
      }
    } else {
      res.json({ response: 'wrong counter, check counter list' });
    }
  }
);

export default router;
