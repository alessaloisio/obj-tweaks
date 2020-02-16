# OBJ-KIT

Library to manipulate javascript object

## Commands
- {Object}.find(conditions)
- {Object}.merge(data)
- {Object}.update(conditions, data)

## Examples
```js
// Working Object
const state = {
  data: {
    users: {
      123456: {
        _id: 123456,
        active: true,
        status: true,
        info: {
          name: 'Alessandro',
          age: 24,
          links: {
            blog: 'https://aloisio.work',
          },
        },
      },
    },
    favourites: {
      234567: {
        _id: 234567,
        active: true,
        status: true,
        info: {
          name: 'Alicia',
          age: 24,
        },
      },
    },
  },
  loading: false,
  error: null,
};
```
### 1. Find
```js
/**
* Simple find
*/
state.find({ active: true })

// output
[
  {
    _id: 123456,
    active: true,
    ...
  },
  {
    _id: 234567,
    active: true,
    ...
  }
]

/**
* If you want information about users who have 24 years
*/
state.find({ age: 24 })

// output
[
  {
    name: 'Alessandro',
    age: 24,
    links: { blog: 'https://aloisio.work' }
  },
  {
    name: 'Alicia',
    age: 24
  }
]

/**
* But if you want the previous object, just add the parent property
*/
state.find({ 'info.age': 24 })

// output
[
  {
    _id: 123456,
    active: true,
    status: true,
    info: { name: 'Alessandro', age: 24, links: [Object] }
  },
  {
    _id: 234567,
    active: true,
    status: true,
    info: { name: 'Alicia', age: 24 }
  }
]
```

### 2. Merge
```js
/**
* Simple merge
*/
state.merge({ 'info.age': 18 })

// output
{
  data: { 
    users: {
      '123456': {
        ...
        info: { age: 18, ... }
      }
    }, 
    favourites: {
      '234567': {
        ...
        info: { age: 18, ... }
      }
    } 
  },
  loading: false,
  error: null
}
```

### 3. Combine
```js
/**
* Combine find and merge
*/
state.find({ _id: 123456 }).merge({ 'info.age': 18 })

// output
[
  {
    _id: 123456,
    active: true,
    status: true,
    info: { name: 'Alessandro', age: 18, links: [Object] }
  }
]
```

### 4. Update
```js
/**
* Update the working Object
*/
state.update({ _id: 123456 }, { status: false, 'info.age': 18 })

// output
{
  data: { 
    users: {
      '123456': {
        _id: 123456,
        active: true,
        status: false,
        info: { name: 'Alessandro', age: 18, links: [Object] }
      }
    }, 
    favourites: { '234567': [Object] } },
  loading: false,
  error: null
}
```

**Of course**, you can also add more conditions on find option and how many you want of depth for sub properties.

## Installation

```sh
npm i @alessio95/object-update
```

```js
import '@alessio95/object-update';
const update = require('@alessio95/object-update');
```

# License

MIT © Aloisio Alessandro
