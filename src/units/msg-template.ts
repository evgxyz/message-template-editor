
import sha1 from 'js-sha1';

// MsgTemplate 

type MsgTemplateNodeType = 'TEXT' | 'IF';

// MsgTemplate (raw structure for data representation)

interface MsgTemplateRawAbstractNode {
  type: MsgTemplateNodeType;
} 

export interface MsgTemplateRawTextNode extends MsgTemplateRawAbstractNode {
  type: 'TEXT';
  text?: string;
} 

export interface MsgTemplateRawIfNode extends MsgTemplateRawAbstractNode {
  type: 'IF';
  condBranch?: MsgTemplateRaw;
  thenBranch?: MsgTemplateRaw;
  elseBranch?: MsgTemplateRaw;
} 

export type MsgTemplateRawNode = (MsgTemplateRawTextNode | MsgTemplateRawIfNode);
export type MsgTemplateRaw = MsgTemplateRawNode[];

// MsgTemplate (structure for internal use)

interface MsgTemplateAbstractNode {
  id: string;
  hash: string;
  type: MsgTemplateNodeType;
} 

export interface MsgTemplateTextNode extends MsgTemplateAbstractNode {
  type: 'TEXT';
  text: string;
} 

export interface MsgTemplateIfNode extends MsgTemplateAbstractNode {
  type: 'IF';
  condBranch: MsgTemplate;
  thenBranch: MsgTemplate;
  elseBranch: MsgTemplate;
} 

export type MsgTemplateNode = (MsgTemplateTextNode | MsgTemplateIfNode);
export type MsgTemplate = MsgTemplateNode[];

export type VarValues = {
  [varName: string]: string;
}

export const msgTemplatefirstTextNodeId = '/0-text';

/* Utility function */

/**
 * Converts a message template from a raw data-object
 * @param templateRaw 
 * @returns new message template 
 */
export function msgTemplateFromRaw(
  templateRaw: MsgTemplateRaw | null | undefined
): MsgTemplate {

  function fromRawREC(
    templateRaw: MsgTemplateRaw | null | undefined, 
    parentNodeId: string
  ) {

    if (!templateRaw || templateRaw.length == 0) {
      templateRaw = [
        {type: 'TEXT', text: ''}
      ];
    }

    const template: MsgTemplate = [];
    let nodeIndex = 0;

    for (let node of templateRaw) {
      if (node.type === 'TEXT') {
        const nodeId = `${parentNodeId}/${nodeIndex}-text`;
        const nodeText = node.text ?? '';
        const nodeHash = sha1(nodeText);

        template.push({
          id: nodeId,
          hash: nodeHash,
          type: 'TEXT',
          text: nodeText
        });

        nodeIndex++;
      }
      else 
      if (node.type === 'IF') {
        const nodeId = `${parentNodeId}/${nodeIndex}-if`;
        template.push({
          id: nodeId,
          hash: '',
          type: 'IF',
          condBranch: fromRawREC(node.condBranch, `${nodeId}-cond`),
          thenBranch: fromRawREC(node.thenBranch, `${nodeId}-then`),
          elseBranch: fromRawREC(node.elseBranch, `${nodeId}-else`)
        });
        nodeIndex++;
      }
    }

    return template;
  }

  return fromRawREC(templateRaw, '');
}

/**
 * Converts a message template to a data-object by removal the redundant id property
 * @param template - message template 
 * @returns message template data-object
 */
export function msgTemplateToRaw(template: MsgTemplate): MsgTemplateRaw {

  function toRawREC(template: MsgTemplate) {
    const templateRaw: MsgTemplateRaw = [];

    for (let node of template) {
      if (node.type === 'TEXT') {
        templateRaw.push({
          type: 'TEXT',
          text: node.text
        });
      }
      else 
      if (node.type === 'IF') {
        templateRaw.push({
          type: 'IF',
          condBranch: toRawREC(node.condBranch),
          thenBranch: toRawREC(node.thenBranch),
          elseBranch: toRawREC(node.elseBranch)
        });
      }
    }

    return templateRaw;
  }

  return toRawREC(template);
}

/**
 * Serialize a message template
 * @param template 
 * @returns string representation of message template
 */
export function msgTemplateStringify(template: MsgTemplate): string {
  return (
    JSON.stringify(msgTemplateToRaw(template))
  )
}

/**
 * Updates the id-s of nodes of a message template 
 * @param template - message template 
 */
function msgTemplateReindex(template: MsgTemplate): void {

  function reindexREC(template: MsgTemplate, parentNodeId: string): void {
    let nodeIndex = 0;

    for (let node of template) {
      if (node.type === 'TEXT') {
        const nodeId = `${parentNodeId}/${nodeIndex}-text`;
        const nodeHash = sha1(node.text);
        node.id = nodeId;
        node.hash = nodeHash;
      }
      else 
      if (node.type === 'IF') {
        const nodeId = `${parentNodeId}/${nodeIndex}-if`;
        node.id = nodeId;
        node.hash = '';

        reindexREC(node.condBranch, `${nodeId}-cond`);
        reindexREC(node.thenBranch, `${nodeId}-then`);
        reindexREC(node.elseBranch, `${nodeId}-else`);
      }

      nodeIndex++;
    }
  }

  reindexREC(template, '');
}

/* msgTemplateGetNodeById */

type MsgTemplateGetNodeByIdReturn = {
  node: MsgTemplateNode,
  nodeParent: MsgTemplate,
  nodeIndex: number
} | {
  node: null;
  nodeParent?: undefined,
  nodeIndex?: undefined
};

/**
 * Searches for a node in a template by its id
 * @param template - message template 
 * @param targetNodeId - id of target node
 * @returns target node, its associated nodeParent and nodeIndex
 */
function msgTemplateGetNodeById(
  template: MsgTemplate, 
  targetNodeId: string
): MsgTemplateGetNodeByIdReturn {
//
  let result: MsgTemplateGetNodeByIdReturn = {node: null};
  let stopFlag = false;

  function searchNodeByIdREC(
    template: MsgTemplate, 
    parentNodeId: string,
    targetTail: string
  ) {
    if (stopFlag) return;

    const tailParts = targetTail.match(/^\/(\d+)(?:\-([\w\-]*))?(\/.+)?$/);

    if (!tailParts) {
      stopFlag = true;
      return;
    }

    const nodeIndex = parseInt(tailParts[1]);
    const nodeTypeSuffix = tailParts[2] ?? '';
    const newTargetTail = tailParts[3] ?? '';

    if (nodeIndex >= template.length) {
      stopFlag = true;
      return;
    }

    const node = template[nodeIndex];

    if (node.type === 'TEXT') {
      const nodeId = `${parentNodeId}/${nodeIndex}-text`;

      if (nodeId === targetNodeId) {
        result = {
          node,
          nodeParent: template,
          nodeIndex
        };
        stopFlag = true;
        return;
      }
    }
    else 
    if (node.type === 'IF') {
      const nodeId = `${parentNodeId}/${nodeIndex}-if`;
      
      if (nodeId === targetNodeId) {
        result = {
          node,
          nodeParent: template,
          nodeIndex
        };
        stopFlag = true;
        return;
      }

      if (nodeTypeSuffix === 'if-cond') {
        searchNodeByIdREC(node.condBranch, `${nodeId}-cond`, newTargetTail);
      } 
      else 
      if (nodeTypeSuffix === 'if-then') {
        searchNodeByIdREC(node.thenBranch, `${nodeId}-then`, newTargetTail);
      } 
      else 
      if (nodeTypeSuffix === 'if-else') {
        searchNodeByIdREC(node.elseBranch, `${nodeId}-else`, newTargetTail);
      }
      else {
        stopFlag = true;
      }
    }
  }

  searchNodeByIdREC(template, '', targetNodeId);

  return result;
}

/* // Simple not optimized version of msgTemplateGetNodeById
  function msgTemplateGetNodeById(
  template: MsgTemplate, 
  targetNodeId: string
): MsgTemplateGetNodeByIdReturn {
//
  let result: MsgTemplateGetNodeByIdReturn = {node: null};
  let stopFlag = false;

  function searchNodeByIdREC(template: MsgTemplate, parentNodeId: string) {
    if (stopFlag) return;

    let nodeIndex = 0;

    for (let node of template) {
      if (node.type === 'TEXT') {
        const nodeId = `${parentNodeId}/${nodeIndex}-text`;
        
        if (nodeId === targetNodeId) {
          result = {
            node,
            nodeParent: template,
            nodeIndex
          };
          stopFlag = true;
          return;
        }
      }
      else 
      if (node.type === 'IF') {
        const nodeId = `${parentNodeId}/${nodeIndex}-if`;
        
        if (nodeId === targetNodeId) {
          result = {
            node,
            nodeParent: template,
            nodeIndex
          };
          stopFlag = true;
          return;
        }

        searchNodeByIdREC(node.condBranch, `${nodeId}-cond`);
        searchNodeByIdREC(node.thenBranch, `${nodeId}-then`);
        searchNodeByIdREC(node.elseBranch, `${nodeId}-else`);
      }

      nodeIndex++;
    }
  }

  searchNodeByIdREC(template, '');

  return result;
} */

/**
 * Inserts a string into a message template
 * @param template - message template
 * @param nodeId - id of target node
 * @param caretPos - caret position of the insertion
 * @param str - inserted string
 * @returns new updated message template
 */
export function msgTemplateInsertStr(
  template: MsgTemplate, 
  nodeId: string, 
  caretPos: number,
  str: string
): MsgTemplate {

  template = structuredClone(template);

  const {node} = msgTemplateGetNodeById(template, nodeId);

  if (node && node.type === 'TEXT') {
    node.text = node.text.substring(0, caretPos) + str + node.text.substring(caretPos);
  }

  return template;
}

/**
 * Changes the text of a TEXT-node in message template
 * @param template - message template
 * @param nodeId - id of the target node
 * @param text - new text
 * @returns new updated message template
 */
export function msgTemplateChangeText(
  template: MsgTemplate, 
  nodeId: string, 
  text: string
): MsgTemplate {

  template = structuredClone(template);

  const {node} = msgTemplateGetNodeById(template, nodeId);

  if (node && node.type === 'TEXT') {
    node.text = text;
  }

  return template;
}

/**
 * Inserts a new IF-node into a message template
 * @param template - message template
 * @param nodeId - id of the target node
 * @param caretPos - caret position of the insertion text
 * @returns new updated message template and active node id or false in failure
 */
export function msgTemplateInsertIfNode(
  template: MsgTemplate, 
  nodeId: string,
  caretPos: number
): {template: MsgTemplate} | false {
//
  template = structuredClone(template);

  const {node, nodeParent, nodeIndex} = 
    msgTemplateGetNodeById(template, nodeId);

  if (!(node && node.type === 'TEXT')) {
    return false;
  }

  const text1 = node.text.substring(0, caretPos);
  const text2 = node.text.substring(caretPos);
  
  node.text = text1;

  const ifNode: MsgTemplateNode = {
    id: '',
    hash: '',
    type: 'IF',
    condBranch: [{id: '', hash: '', type: 'TEXT', text: ''}],
    thenBranch: [{id: '', hash: '', type: 'TEXT', text: ''}],
    elseBranch: [{id: '', hash: '', type: 'TEXT', text: ''}]
  }

  const textNode2: MsgTemplateNode = 
    {id: '', hash: '', type: 'TEXT', text: text2};

  nodeParent.splice(nodeIndex + 1, 0, ifNode, textNode2);

  msgTemplateReindex(template);

  return {template};
}

/**
 * Deletes a IF-node from a message template
 * @param template - message template
 * @param nodeId - id of the node to be deleted
 * @returns new updated message template, active NodeId and caretPos or false in failure
 */
export function msgTemplateDeleteIfNode(
  template: MsgTemplate, 
  nodeId: string
): {
  template: MsgTemplate;
  activeNodeId: string;
  activeCaretPos: number;
} | false {
//
  template = structuredClone(template);
  
  const {node, nodeParent, nodeIndex} 
    = msgTemplateGetNodeById(template, nodeId);

  if (!(node && node.type === 'IF')) {
    return false;
  }

  let isPrevTextNode = false;
  let text1 = '';
  const prevNode = nodeParent[nodeIndex - 1];
  if (prevNode && prevNode.type === 'TEXT') {
    isPrevTextNode = true;
    text1 = prevNode.text;
  }

  let isNextTextNode = false;
  let text2 = '';
  const nextNode = nodeParent[nodeIndex + 1];
  if (nextNode && nextNode.type === 'TEXT') {
    isNextTextNode = true;
    text2 = nextNode.text;
  }

  let text12 = text1 + text2;

  const textNode: MsgTemplateNode = 
    {id: '', hash: '', type: 'TEXT', text: text12};

  const delStart = isPrevTextNode ? nodeIndex - 1 : nodeIndex;
  const delStop = isNextTextNode ? nodeIndex + 1 : nodeIndex;
  const delCount = delStop - delStart + 1;

  nodeParent.splice(delStart, delCount, textNode);

  msgTemplateReindex(template);

  return {
    template, 
    activeNodeId: textNode.id,
    activeCaretPos: text1.length
  }
}

/**
 * Generates a message from a template using values 
 * @param template - message template
 * @param values - values of variables
 * @returns message text
 */
export function generateMsg(
  template: MsgTemplateRaw | null | undefined, 
  values?: VarValues | null | undefined
): string {

  template ??= [];

  function generateMsgREC(template: MsgTemplateRaw | null | undefined) {
    template ??= [];

    let text = '';

    for (let node of template) {
      if (node.type === 'TEXT') {
        text += (node.text ?? '')
          .replace(/\{([\w\s\-\.]+)\}/g, (match, p1) => {
            if (values && values.hasOwnProperty(p1)) {
              return values[p1];
            } else {
              return match;
            }
          });
      }
      else 
      if (node.type === 'IF') {
        const condText = generateMsgREC(node.condBranch);
        if (condText !== '') {
          text += generateMsgREC(node.thenBranch);
        } 
        else {
          text += generateMsgREC(node.elseBranch);
        }
      }
    }

    return text;
  }

  return generateMsgREC(template);
}
