
Шаблон сообщения представляет из себя массив, содержащий узлы двух типов: текстовый или IF-блок. В свою очередь IF-блок содержит condition, then, else -ветки, которые также являются шаблонами, т.е. массивами, которые могут содержать узлы двух типов. Например:

[
  {
    "type": "TEXT",
    "text": "Hello, {firstname}."
  },
  {
    "type": "IF",
    "condBranch": [
      {
        "type": "TEXT",
        "text": "{company}"
      }
    ],
    "thenBranch": [
      {
        "type": "TEXT",
        "text": " I know you work at {company}"
      },
      {
        "type": "IF",
        "condBranch": [
          {
            "type": "TEXT",
            "text": "{position}"
          }
        ],
        "thenBranch": [
          {
            "type": "TEXT",
            "text": " as {position}"
          }
        ],
        "elseBranch": [
          {
            "type": "TEXT",
            "text": ", but what is your role?"
          }
        ]
      },
      {
        "type": "TEXT",
        "text": " ;)"
      }
    ],
    "elseBranch": [
      {
        "type": "TEXT",
        "text": " Where do you work at the moment?"
      }
    ]
  },
  {
    "type": "TEXT",
    "text": " Kindest regards, John."
  }
]

Для работы с шаблоном в каждый узел шаблона добавляется уникальный идентификатор и хэш, как показано в пример ниже. Слеши отделют уровни вложенности, число равно порядковому индексу узла среди своих соседей в массиве, хэш - это sha1 от текстового содержимого узла.

[
  {
    "id": "/0-text"
    "hash": "7f5fdf63f44272d1b9e0b6d2e95ad43e3c2e9ff8"
    "type": "TEXT",
    "text": "Hello, {firstname}."
  },
  {
    "type": "IF",
    "id": "/0-if"
    "hash": ""
    "condBranch": [
      {
        "id": "/0-if-cond/0-text"
        "hash": "9f5fdf63f44272d1b9e0b6d2e95ad43e3c2e9331"
        "type": "TEXT",
        "text": "{company}"
      }
    ],
    "thenBranch": [
      {
        "id": "/0-if-then/0-text"
        "hash": "2a5fdf63f44272d1b9e0b6d2e95ad43e3c2e9336"
        "type": "TEXT",
        "text": " I know you work at {company}"
      },
      {
        "id": "/0-if-then/1-if"
        "hash": ""
        "type": "IF",
        "condBranch": [
          {
            "id": "/0-if-then/1-if-cond/0-text"
            "hash": "6b5fdf63f44272d1b9e0b6d2e95ad43e3c2e9337"
            "type": "TEXT",
            "text": "{position}"
          }
        ],
        "thenBranch": [
          {
            "id": "/0-if-then/1-if-then/0-text"
            "hash": "0b5fdf63f44272d1b9e0b6d2e95ad43e3c2e9330"
            "type": "TEXT",
            "text": " as {position}"
          }
        ],
        "elseBranch": [
          {
            "id": "/0-if-then/1-if-else/0-text"
            "hash": "255fdf63f44272d1b9e0b6d2e95ad43e3c2e9351"
            "type": "TEXT",
            "text": ", but what is your role?"
          }
        ]
      },
      {
        "id": "/0-if-then/2-text"
        "hash": "8a5fdf63f44272d1b9e0b6d2e95ad43e3c2e93a8"
        "type": "TEXT",
        "text": " ;)"
      }
    ],
    "elseBranch": [
      {
        "id": "/0-if-else/0-text"
        "hash": "115fdf63f44272d1b9e0b6d2e95ad43e3c2e9301"
        "type": "TEXT",
        "text": " Where do you work at the moment?"
      }
    ]
  },
  {
    "id": "/2-text"
    "hash": "f15fdf63f44272d1b9e0b6d2e95ad43e3c2e930d"
    "type": "TEXT",
    "text": " Kindest regards, John."
  }
]

С помощью идентификаторов устанавливается связь между узлами и соотвествующими DOM-элементами. При событии на текстовом поле через колбек передается идентификатор узла, происходит модификация соотвествующего узла шаблона, переиндексация узлов при необходимости, после чего все заново рендерится в DOM.

Идентификатор + хеш используется в качестве значений key для reconciliation.

Шаблон сообщения, информация о позиции курсора, информация о фокусировке объединены в один объект-стейт и меняются согласованно и синхронно. 

Идентификаторы и ключи узлов можно увидеть в HTML-коде в атрибутах data-id и data-hash. Но они добавлены только для наглядности и не используются для обращения к DOM-элементам. Доступ к DOM-элементам происходит только по ссылкам, полученным из useRef().

Самой нагруженной вспомогательной функцией является msgTemplateGetNodeById, которая ищет в шаблоне узел его идентификатору. Она вызывается при каждом изменении текста в редакторе. 
Есть два варианта этой функции: 
Первый простой (закомментирован), когда узел ищется путем обхода всех узлов шаблона и сопоставления идентификаторов с искомым. 
Второй более оптимизированный, когда при обходе шаблона на каждом уровне рекурсии парсится хвост искомого идентификатора, откуда достаются индексы и тип ветки (then или else). 
Например из "/3-if-then/2-if-else/0-text" выделяется индекс 3, отличитальный суффикс подветки "if-then", на следующий этап итерации передается оставшийся хвост "/2-if-else/0-text" и т.д.
Это позволяет не исследовать лишние ветки и узлы.
Вряд ли такая оптимизация нужна для того количества узлов, которые могут быть на практике, но этот вариант оставлен для красоты.

Компонеты TextAreaAutosize и InputTextLabeled сделаны с использованием React.forwardRef.
В TextAreaAutosize также применятся композиция локальной ссылки и ссылки, получаемой с пропсами извне.

Модальные окна реализуются с помощью компонента ModalWindow и рендерятся в отдельный блок через портал. 

При открытии модального окна выключается прокрутка основной страницы. 
Для отслеживания и подсчета открытых модальных окон, модальные окна при открытии регистрируются в глобальной переменной appEnv.openModalWindows. 
Методы работы с хранилищем глобальных переменных appEnv реализованы с помощью createContext, useContext и вынесены в отдельный хук useAppEnvControl. 

При вставке переменной фокус переходит на измененняемое поле, курсор становится после вставленной строки.
При удалении IF-блока фокус переходит в объединенное текстовое поле, а курсор становится в место склейки двух строк. 

Вставить IF-блок можно сочетанием клавиш Alt+I.

Вставить переменную можно нажатием Enter, когда фокус находится в меню на блоке с переменной.
Переместить фокус на меню вставки переменных можно сочетанием клавиш Alt+V.
Перемещать фокус по меню вставки переменных можно клавишами <= и => (в этом случае для обращения к DOM-элементам используется массив ссылок в стейте).

При открытии окна редатора фокус устанавливается на первое текстово поле.
При открытии окна предпросмотра фокус устанавливается на поле с первой переменной.
При закрытии окна предпросмотра в редаторе фокус не теряется с модального окна, а снова устанавливается на первое текстово поле.

При перемещении фокуса с помощью Tab и Shift+Tab фокус не выходит за пределы модального окна. Элементы управления циклическим перемещением фокуса вынесены в отдельный хук useFocusLoop.

Чтобы работали алиасы @/*, определения добавлены в tsconfig.json, в package.json добавлена настройка для jest, приложение и тесты запускаются через craco.

Тесты для функции generateMsg лежат в папке tests.
npm run test /src/tests/generateMsg.test.ts
