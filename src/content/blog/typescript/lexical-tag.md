---
title: 'Lexical 패키지를 사용한 태그 기능 구현'
short: ''
---

해당 라이브러리는 문서가 자세히 없고 대부분 React를 사용하는데 초점이 잡혀져 있었다. 그래서 Svelte를 사용하는 프로젝트에서 사용하기 위해 사실상 바닐라 JS로 Svelte에 구현하였다.

기본적인 텍스트 입력이 되는 에디터를 만드는 코드는 다음과 같다.

```svelte
<!-- Editor.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import lexical from 'lexical';
    import { registerPlainText } from '@lexical/plain-text';
    export let editorDiv: HTMLDivElement;
    const { LineBreakNode, ParagraphNode, TextNode } = lexical;
    const config = {
        namespace: 'temp',
        true, // editable
        error: console.error,
        nodes: [LineBreakNode, ParagraphNode, TextNode] // 에디터에서 사용될 구성요소
    };
    let editor: lexical.LexicalEditor = lexical.createEditor(config);

    onMount(() => {
        registerPlainText(editor);
    })
</script>

<div bind:this={editorDiv} contenteditable="true"/>
```

여기서 해시태그를 넣기 위하여 TextNode를 기반으로 새로운 구성요소를 만든다.

```ts
// Recommend.ts
import lexical from 'lexical';
import type { NodeKey, EditorConfig } from 'lexical';

const { TextNode } = lexical;

export default class RecommendNode extends TextNode {
  subtype: string;
  prefix: string;
  onclick?: (e: string) => void;

  constructor(text: string, subtype: string, prefix: string, onclick?: (e: string) => void, key?: NodeKey) {
    // 해당 노드에 필요한 속성 정의
    super(text, key);
    this.__subtype = subtype;
    this.__prefix = prefix;
    this.__onclick = onclick;
  }

  static getType(): string {
    return 'recommend';
  }

  static clone(node: RecommendNode) {
    return new RecommendNode(node.__text, node.__subtype, node.__prefix, node.__onclick, node.__key);
  }

  getSubtype(): string {
    return this.__subtype;
  }

  createDOM(config: EditorConfig) {
    const element = super.createDOM(config);
    // 태그의 스타일, 이벤트 지정
    element.style.fontWeight = '400';
    element.style.color = '#4287ff';
    if (this.__onclick) element.style.cursor = 'pointer';
    element.addEventListener('click', () => {
      if (this.__onclick) {
        this.__onclick(this.__text.replace(this.__prefix, ''));
      }
    });
    return element;
  }

  updateDOM(prevNode: RecommendNode, dom: HTMLElement, config: EditorConfig): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    return isUpdated;
  }

  getContent() {
    return super.getTextContent().replace(this.__prefix, '');
  }

  setContent(value: string) {
    return super.setTextContent(`${this.__prefix}${value}`);
  }
}
```

그리고 이 노드를 사용하기 위해 아까 전의 config에 추가한다.

```ts
    // Editor.svelte
    import RecommendNode from 'Recommend';
    const config = {
        namespace: 'temp',
        true, // editable
        error: console.error,
        nodes: [LineBreakNode, ParagraphNode, TextNode, RecommendNode]
    };
```

이제 # 등의 해시태그 시작 기호에 반응하기 위해 에디터에 이벤트를 추가하여야 한다.
편의와 재사용성를 위해 기존 에디터 코드가 아닌 새로운 Svelte 컴포넌트를 만든다.

```svelte
<!-- Recommend.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import RecommendNode from 'Recommend';
    export let type: string;
    export let prefix: string;
    export let editor: lexical.LexicalEditor;
    const { COMMAND_PRIORITY_NORMAL, TextNode } = lexical;

    onMount(() => {
        // 일반 텍스트 입력 노드인 TextNode에 이벤트를 수신하여 prefix(ex. #)가 입력되면 RecommendNode를 생성
        editor.registerNodeTransform(TextNode, (textNode) => {
            const selection = lexical.$getSelection();
            if (lexical.$isRangeSelection(selection)) {
                const node = lexical.$getNodeByKey(selection.focus.key);
                const inputChar = node?.getTextContent().charAt(selection.focus.offset - 1);
                if (node && node.getType() === 'text' && inputChar === prefix) {
                    const left = textNode.getTextContent().substring(0, selection.focus.offset - 1);
                    const right = textNode.getTextContent().substring(selection.focus.offset);
                    node.setTextContent(`${left} `);
                    const recommendNode = new RecommendNode(prefix, type, prefix, (e) => {});
                    node.insertAfter(recommendNode);
                    recommendNode.insertAfter(lexical.$createTextNode(` ${right}`));
                    node.selectNext();
                }
            }
        });

        // 스페이스키가 입력되면 노드 끝내기
        editor.registerCommand(
                lexical.KEY_SPACE_COMMAND,
                (payload) => {
                    editor.update(() => {
                        const selection = lexical.$getSelection();
                        if (lexical.$isRangeSelection(selection)) {
                            const node = lexical.$getNodeByKey(selection.focus.key);
                            if (node && node.getType() === 'recommend' && node.getSubtype() === type) {
                                exitNode(node);
                                payload?.preventDefault();
                            }
                        }
                    });
                    return false;
                },
                COMMAND_PRIORITY_NORMAL
            );
    });

    // 노드 뒤에 새로운 TextNode생성 후 커서 이동
    function exitNode(node: lexical.LexicalNode) {
        if (isNewAllowed || list.length > 0) {
            if (!isNewAllowed) node.setContent(list[selected][key]);
            if (node.__next) {
                const next = lexical.$getNodeByKey(node.__next) as lexical.TextNode;
                next.select(1, 1);
            } else {
                const tmp = lexical.$createTextNode(' ');
                node.insertAfter(tmp);
                tmp.selectNext();
            }
        } else {
            const tmp = lexical.$createTextNode(node.getTextContent());
            node.replace(tmp);
        }
    }
</script>
```

새롭게 만든 컴포넌트를 기존의 에디터가 있는 곳에 추가해준다.

```svelte
<!-- Editor.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import lexical from 'lexical';
    import { registerPlainText } from '@lexical/plain-text';
    export let editorDiv: HTMLDivElement;
    const { LineBreakNode, ParagraphNode, TextNode } = lexical;
    const config = {
        namespace: 'temp',
        true, // editable
        error: console.error,
        nodes: [LineBreakNode, ParagraphNode, TextNode] // 에디터에서 사용될 구성요소
    };
    let editor: lexical.LexicalEditor = lexical.createEditor(config);

    onMount(() => {
        registerPlainText(editor);
    })
</script>

<div bind:this={editorDiv} contenteditable="true"/>
<Recommend type="hashtag" prefix="#" {editor} />
```

#으로 시작하는 태그들이 새로운 노드를 통하여 자동으로 생성되고 스페이스를 통해 종료할 수 있을 것이다.
