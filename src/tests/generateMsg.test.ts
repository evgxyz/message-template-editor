
import { MsgTemplateRaw, generateMsg } from '@/units/msg-template';

/**
 * Work with null or undefined input arguments
 */
describe('generateMsg: Work with null or undefined input arguments', () => {
  const template: MsgTemplateRaw = [
    {
      type: 'TEXT',
      text: 'Hello, {firstname}.'
    },
    {
      type: 'IF',
      condBranch: [
        {
          type: 'TEXT',
          text: '{company}'
        }
      ],
      thenBranch: [
        {
          type: 'TEXT',
          text: ' I know you work at {company}'
        },
        {
          type: 'IF',
          condBranch: [
            {
              type: 'TEXT',
              text: '{position}'
            }
          ],
          thenBranch: [
            {
              type: 'TEXT', 
              text: ' as {position}'
            }
          ],
          elseBranch: [
            {
              type: 'TEXT', 
              text: ', but what is your role?'
            }
          ]
        },
        {
          type: 'TEXT',
          text: ' ;)'
        }
      ],
      elseBranch: [
        {
          type: 'TEXT',
          text: ' Where do you work at the moment?'
        }
      ]
    },
    {
      type: 'TEXT',
      text: ' Kindest regards, John.'
    }
  ];
  
  const values = {
    firstname: 'Peter', 
    lastname: 'Parker', 
    company: 'Web Studio', 
    position: 'programmer'
  }

  test('if the template is undefined or null, doesn\'t throw an error', () => { 
    expect(() => generateMsg(undefined, values)).not.toThrow();
    expect(() => generateMsg(null, values)).not.toThrow();
  });

  test('if the template is undefined or null, returns an empty string', () => { 
    expect(generateMsg(undefined, values)).toBe('');
    expect(generateMsg(null, values)).toBe('');
  });

  test('if the values is undefined or null, doesn\'t throw an error', () => { 
    expect(() => generateMsg(template, undefined)).not.toThrow();
    expect(() => generateMsg(template, null)).not.toThrow();
  });

  test('if the values is undefined or null, returns a string', () => { 
    expect(typeof generateMsg(template, undefined)).toBe('string');
    expect(typeof generateMsg(template, null)).toBe('string');
  });
});

/**
 * Simple expression in the condition
 */
describe('generateMsg: Simple expression in the condition', () => {
  test('If the condition contains a non-empty ordinary text, the then-branch is selected', () => { 
    const template: MsgTemplateRaw = [
      {
        type: 'TEXT',
        text: 'Hello, {firstname}.'
      },
      {
        type: 'IF',
        condBranch: [
          {
            type: 'TEXT',
            text: 'Ordinary text in the condition.'
          }
        ],
        thenBranch: [
          {
            type: 'TEXT',
            text: ' I know you work at {company}'
          },
          {
            type: 'IF',
            condBranch: [
              {
                type: 'TEXT',
                text: '{position}'
              }
            ],
            thenBranch: [
              {
                type: 'TEXT', 
                text: ' as {position}'
              }
            ],
            elseBranch: [
              {
                type: 'TEXT', 
                text: ', but what is your role?'
              }
            ]
          },
          {
            type: 'TEXT',
            text: ' ;)'
          }
        ],
        elseBranch: [
          {
            type: 'TEXT',
            text: ' Where do you work at the moment?'
          }
        ]
      },
      {
        type: 'TEXT',
        text: ' Kindest regards, John.'
      }
    ];
  
    const values = {
      firstname: 'Peter', 
      lastname: 'Parker', 
      company: 'Web Studio', 
      position: 'programmer'
    }

    expect(generateMsg(template, values))
      .toMatch('I know you work at ');

    expect(generateMsg(template, values))
      .not.toMatch('Where do you work at the moment?');
  });

  test('If the condition contains an ordinary text in curly brackets, the then-branch is selected', () => { 
    const template: MsgTemplateRaw = [
      {
        type: 'TEXT',
        text: 'Hello, {firstname}.'
      },
      {
        type: 'IF',
        condBranch: [
          {
            type: 'TEXT',
            text: '{company}'
          }
        ],
        thenBranch: [
          {
            type: 'TEXT',
            text: ' I know you work at {company}'
          },
          {
            type: 'IF',
            condBranch: [
              {
                type: 'TEXT',
                text: '{position}'
              }
            ],
            thenBranch: [
              {
                type: 'TEXT', 
                text: ' as {position}'
              }
            ],
            elseBranch: [
              {
                type: 'TEXT', 
                text: ', but what is your role?'
              }
            ]
          },
          {
            type: 'TEXT',
            text: ' ;)'
          }
        ],
        elseBranch: [
          {
            type: 'TEXT',
            text: ' Where do you work at the moment?'
          }
        ]
      },
      {
        type: 'TEXT',
        text: ' Kindest regards, John.'
      }
    ];
  
    const values1 = {
      firstname: 'Peter', 
      lastname: 'Parker', 
      //company: 'Web Studio',
      position: 'programmer'
    }

    expect(generateMsg(template, values1))
      .toMatch('I know you work at ');

    expect(generateMsg(template, values1))
      .not.toMatch('Where do you work at the moment?');

    const values2 = {
      firstname: 'Peter', 
      lastname: 'Parker', 
      company: 'Web Studio',
      //position: 'programmer'
    }

    expect(generateMsg(template, values2))
      .toMatch(' as ');

    expect(generateMsg(template, values2))
      .not.toMatch(' but what is your role?');
  });

  test('If the condition is empty, the else-branch is selected', () => { 
    const template: MsgTemplateRaw = [
      {
        type: 'TEXT',
        text: 'Hello, {firstname}.'
      },
      {
        type: 'IF',
        condBranch: [
          {
            type: 'TEXT',
            text: ''
          }
        ],
        thenBranch: [
          {
            type: 'TEXT',
            text: ' I know you work at {company}'
          },
          {
            type: 'IF',
            condBranch: [
              {
                type: 'TEXT',
                text: '{position}'
              }
            ],
            thenBranch: [
              {
                type: 'TEXT', 
                text: ' as {position}'
              }
            ],
            elseBranch: [
              {
                type: 'TEXT', 
                text: ', but what is your role?'
              }
            ]
          },
          {
            type: 'TEXT',
            text: ' ;)'
          }
        ],
        elseBranch: [
          {
            type: 'TEXT',
            text: ' Where do you work at the moment?'
          }
        ]
      },
      {
        type: 'TEXT',
        text: ' Kindest regards, John.'
      }
    ];
  
    const values = {
      firstname: 'Peter', 
      lastname: 'Parker', 
      company: 'Web Studio', 
      position: 'programmer'
    }

    expect(generateMsg(template, values))
      .not.toMatch('I know you work at ');

    expect(generateMsg(template, values))
      .toMatch('Where do you work at the moment?');
  });

  test('If the condition contains a variable with empty value, the else-branch is selected', () => { 
    const template: MsgTemplateRaw = [
      {
        type: 'TEXT',
        text: 'Hello, {firstname}.'
      },
      {
        type: 'IF',
        condBranch: [
          {
            type: 'TEXT',
            text: '{company}'
          }
        ],
        thenBranch: [
          {
            type: 'TEXT',
            text: ' I know you work at {company}'
          },
          {
            type: 'IF',
            condBranch: [
              {
                type: 'TEXT',
                text: '{position}'
              }
            ],
            thenBranch: [
              {
                type: 'TEXT', 
                text: ' as {position}'
              }
            ],
            elseBranch: [
              {
                type: 'TEXT', 
                text: ', but what is your role?'
              }
            ]
          },
          {
            type: 'TEXT',
            text: ' ;)'
          }
        ],
        elseBranch: [
          {
            type: 'TEXT',
            text: ' Where do you work at the moment?'
          }
        ]
      },
      {
        type: 'TEXT',
        text: ' Kindest regards, John.'
      }
    ];
  
    const values = {
      firstname: 'Peter', 
      lastname: 'Parker', 
      company: '', 
      position: 'programmer'
    }

    expect(generateMsg(template, values))
      .not.toMatch('I know you work at ');

    expect(generateMsg(template, values))
      .toMatch('Where do you work at the moment?');

    const values2 = {
      firstname: 'Peter', 
      lastname: 'Parker', 
      company: 'Web Studio', 
      position: ''
    }

    expect(generateMsg(template, values2))
      .not.toMatch(' as ');

    expect(generateMsg(template, values2))
      .toMatch(' but what is your role?');
  });
});

/**
 * Calculated value in the condition
 */
describe('generateMsg: Calculated value in the condition', () => {
  test('If the condition contains two variable patterns, the branch is selected correctly', () => { 
    const template: MsgTemplateRaw = [
      {
        type: 'TEXT',
        text: 'Hello, {firstname}.'
      },
      {
        type: 'IF',
        condBranch: [
          {
            type: 'TEXT',
            text: '{firstname}{lastname}'
          }
        ],
        thenBranch: [
          {
            type: 'TEXT',
            text: 'Text in the then-branch.'
          },
        ],
        elseBranch: [
          {
            type: 'TEXT',
            text: 'Text in the else-branch.'
          }
        ]
      },
      {
        type: 'TEXT',
        text: 'Kindest regards, John.'
      }
    ];
  
    const values1 = {
      firstname: 'Peter', 
      lastname: 'Parker'
    }

    expect(generateMsg(template, values1))
      .toMatch('Text in the then-branch');

    expect(generateMsg(template, values1))
      .not.toMatch('Text in the else-branch');

    const values2 = {
      firstname: 'Peter',
      lastname: ''
    }

    expect(generateMsg(template, values2))
      .toMatch('Text in the then-branch');

    expect(generateMsg(template, values2))
      .not.toMatch('Text in the else-branch');

    const values3 = {
      firstname: '',
      lastname: 'Parker'
    }

    expect(generateMsg(template, values3))
      .toMatch('Text in the then-branch');

    expect(generateMsg(template, values3))
      .not.toMatch('Text in the else-branch');

    const values4 = {
      firstname: '', 
      lastname: ''
    }

    expect(generateMsg(template, values4))
      .not.toMatch('Text in the then-branch');

    expect(generateMsg(template, values4))
      .toMatch('Text in the else-branch');
  });

  test('If the condition contains the IF-block that returns a non-empty value, the then-branch is selected', () => { 
    const template: MsgTemplateRaw = [
      {
        type: 'TEXT',
        text: 'Hello, {firstname}.'
      },
      {
        type: 'IF',
        condBranch: [
          {
            type: 'TEXT',
            text: ''
          },
          {
            type: 'IF',
            condBranch: [
              {
                type: 'TEXT',
                text: 'Non empty text in the condition of child IF-block.'
              }   
            ],
            thenBranch: [
              {
                type: 'TEXT',
                text: 'Text in the child then-branch.'
              },
            ],
            elseBranch: [
              {
                type: 'TEXT',
                text: ''
              }
            ]
          },
          {
            type: 'TEXT',
            text: ''
          }
        ],
        thenBranch: [
          {
            type: 'TEXT',
            text: 'Text in the then-branch.'
          },
        ],
        elseBranch: [
          {
            type: 'TEXT',
            text: 'Text in the else-branch.'
          }
        ]
      },
      {
        type: 'TEXT',
        text: 'Kindest regards, John.'
      }
    ];
  
    const values = {
      firstname: 'Peter', 
      lastname: 'Parker'
    }

    expect(generateMsg(template, values))
      .toMatch('Text in the then-branch');

    expect(generateMsg(template, values))
      .not.toMatch('Text in the else-branch');
  });

  test('If the condition contains the IF-block that returns an empty value, the else-branch is selected', () => { 
    const template: MsgTemplateRaw = [
      {
        type: 'TEXT',
        text: 'Hello, {firstname}.'
      },
      {
        type: 'IF',
        condBranch: [
          {
            type: 'TEXT',
            text: ''
          },
          {
            type: 'IF',
            condBranch: [
              {
                type: 'TEXT',
                text: 'Non empty text in the condition of child IF-block.'
              }   
            ],
            thenBranch: [
              {
                type: 'TEXT',
                text: ''
              },
            ],
            elseBranch: [
              {
                type: 'TEXT',
                text: 'Text in the child then-branch.'
              }
            ]
          },
          {
            type: 'TEXT',
            text: ''
          }
        ],
        thenBranch: [
          {
            type: 'TEXT',
            text: 'Text in the then-branch.'
          },
        ],
        elseBranch: [
          {
            type: 'TEXT',
            text: 'Text in the else-branch.'
          }
        ]
      },
      {
        type: 'TEXT',
        text: 'Kindest regards, John.'
      }
    ];
  
    const values = {
      firstname: 'Peter', 
      lastname: 'Parker'
    }

    expect(generateMsg(template, values))
      .not.toMatch('Text in the then-branch');

    expect(generateMsg(template, values))
      .toMatch('Text in the else-branch');
  });
});

/**
 * Replacing variable patterns in the text
 */
describe('generateMsg: Replacing variable patterns in the text', () => {
  const template: MsgTemplateRaw = [
    {
      type: 'TEXT',
      text: 'First pattern {firstname} in the text.'
    },
    {
      type: 'IF',
      condBranch: [
        {
          type: 'TEXT',
          text: ' Some text in the condition.'
        }
      ],
      thenBranch: [
        {
          type: 'TEXT',
          text: ' Second pattern {secondname} in the then-branch.'
        }
      ],
      elseBranch: [
        {
          type: 'TEXT',
          text: ' Some text in the else-branch.'
        }
      ]
    },
    {
      type: 'IF',
      condBranch: [
        {
          type: 'TEXT',
          text: ''
        }
      ],
      thenBranch: [
        {
          type: 'TEXT',
          text: ' Some text in second then-branch.'
        }
      ],
      elseBranch: [
        {
          type: 'TEXT',
          text: ' Third pattern {thirdname} in the else-branch.'
        }
      ]
    },
    {
      type: 'TEXT',
      text: ' Fourth pattern {fourthname} in the text.'
    }
  ];

  test('if the variable is set and not empty, the pattern in text is replaced', () => { 
    const values = {
      firstname: 'Apple',
      secondname: 'Banana',
      thirdname: 'Cherry',
      fourthname: 'Grapefruit'
    }

    expect(generateMsg(template, values))
      .toMatch('First pattern Apple in the text');
    
    expect(generateMsg(template, values))
      .toMatch('Second pattern Banana in the then-branch');

    expect(generateMsg(template, values))
      .toMatch('Third pattern Cherry in the else-branch');

    expect(generateMsg(template, values))
      .toMatch('Fourth pattern Grapefruit in the text');
  });

  test('if the variable is set and empty, the pattern in text is replaced with empty string', () => { 
    const values1 = {
      firstname: '',
      secondname: '',
      thirdname: '',
      fourthname: ''
    }

    expect(generateMsg(template, values1))
      .toMatch('First pattern  in the text');
    
    expect(generateMsg(template, values1))
      .toMatch('Second pattern  in the then-branch');

    expect(generateMsg(template, values1))
      .toMatch('Third pattern  in the else-branch');

    expect(generateMsg(template, values1))
      .toMatch('Fourth pattern  in the text');
  });

  test('if the variable is not set, the pattern in text is not replaced', () => { 
    const values = {
      somename: 'I am set'
    }

    expect(generateMsg(template, values))
      .toMatch('First pattern {firstname} in the text');
    
    expect(generateMsg(template, values))
      .toMatch('Second pattern {secondname} in the then-branch');

    expect(generateMsg(template, values))
      .toMatch('Third pattern {thirdname} in the else-branch');

    expect(generateMsg(template, values))
      .toMatch('Fourth pattern {fourthname} in the text');
  });

  test('If the value of the first variable is equal to the pattern for the second variable, it is not replaced again', () => { 
    const template: MsgTemplateRaw = [
      {
        type: 'TEXT',
        text: 'First pattern {firstname} and second pattern {secondname} in the text.'
      }
    ];
    
    const values = {
      firstname: '{secondname}',
      secondname: 'Banana'
    }

    expect(generateMsg(template, values))
      .toBe('First pattern {secondname} and second pattern Banana in the text.');
  });
});

/**
 * Complex test
 */
describe('generateMsg: Complex test', () => {
  const template: MsgTemplateRaw = [
    {
      type: 'TEXT',
      text: 'Hello, {firstname}.'
    },
    {
      type: 'IF',
      condBranch: [
        {
          type: 'TEXT',
          text: '{company}'
        }
      ],
      thenBranch: [
        {
          type: 'TEXT',
          text: ' I know you work at {company}'
        },
        {
          type: 'IF',
          condBranch: [
            {
              type: 'TEXT',
              text: '{position}'
            }
          ],
          thenBranch: [
            {
              type: 'TEXT', 
              text: ' as {position}'
            }
          ],
          elseBranch: [
            {
              type: 'TEXT', 
              text: ', but what is your role?'
            }
          ]
        },
        {
          type: 'TEXT',
          text: ' ;)'
        }
      ],
      elseBranch: [
        {
          type: 'TEXT',
          text: ' Where do you work at the moment?'
        }
      ]
    },
    {
      type: 'TEXT',
      text: ' Kindest regards, John.'
    }
  ];

  test('The text is generated from the template as expected', () => { 
    const values1 = {
      firstname: 'Peter', 
      lastname: 'Parker', 
      company: '',
      position: ''
    };

  expect(generateMsg(template, values1))
    .toBe('Hello, Peter. Where do you work at the moment? Kindest regards, John.');

  const values2 = {
    firstname: 'Peter', 
    lastname: 'Parker', 
    company: 'Web Studio',
    position: ''
  };

  expect(generateMsg(template, values2))
    .toBe('Hello, Peter. I know you work at Web Studio, but what is your role? ;) Kindest regards, John.');

  const values3 = {
    firstname: 'Peter', 
    lastname: 'Parker', 
    company: 'Web Studio',
    position: 'programmer'
  };

  expect(generateMsg(template, values3))
    .toBe('Hello, Peter. I know you work at Web Studio as programmer ;) Kindest regards, John.');
  });
});