import * as mongoose from 'mongoose';

import { SpecConstants } from '../modules/spec.constants';

mongoose.set('useCreateIndex', true);

mongoose.connect(
    SpecConstants.DATASOURCE_INTEG,
    { useNewUrlParser: true }
);