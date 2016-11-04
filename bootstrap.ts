/**
 * Created by tushar.mathur on 03/11/16.
 */

import {main} from './src/components/Main'
import * as O from 'observable-air'

O.forEach(x => x.run() , main())

