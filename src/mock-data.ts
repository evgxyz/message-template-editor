
import { MsgTemplateRaw } from '@/units/msg-template';

export const mockArrVarNames: string[] = [
  'firstname', 
  'lastname', 
  'company', 
  'position'
];

export const mockMsgTemplate: MsgTemplateRaw = [
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

export const mockMsgTemplateJSON = JSON.stringify(mockMsgTemplate);
