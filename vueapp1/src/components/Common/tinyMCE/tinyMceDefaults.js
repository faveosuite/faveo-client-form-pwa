export const plugins = [
    'preview', 'importcss', 'searchreplace', 'autolink', 'autosave', 'save', 'directionality', 'code',
    'visualblocks', 'visualchars', 'image', 'link', 'media', 'codesample', 'table', 'charmap', 'pagebreak',
    'nonbreaking', 'insertdatetime', 'advlist', 'lists','fullscreen', 'wordcount', 'help', 'charmap', 'emoticons'
];

export const editorProps = {

    height : {type: Number, default: 400},

    showMenubar: {type: Boolean, default: true},

    toolbarSticky: {type: Boolean, default: false,},

    imageAdvancedTab: {type: Boolean, default: true},

    imageCaption: {type: Boolean, default: true},

    toolbarMode: {type: String, default: 'sliding'},

    contentStyle: {type:String, default:'p { margin: 0; } .mce-content-body table:not([border]) td { border: 1px solid black } body { font-family:"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"; font-size:.875rem; } .mce-toc {border: 1px solid gray;}.mce-toc h2 {margin: 4px;}.mce-content-body [contentEditable=true] {cursor: text;}.mce-content-body [contentEditable=false] {cursor: default;}.mce-toc ul>li {list-style-type: none;}'},

    draggableModal: {type: Boolean, default: true},

    elementPath: {type: Boolean, default:false},

    resize: {type:Boolean, default: false},

    branding: {type:Boolean, default: false},

    browserSpellcheck: {type:Boolean, default:true},

    customUndoRedoLevels: {type:Number, default: 10},

    pasteDataImages: {type: Boolean, default: true},

    statusbar: {type: Boolean, default: false},

    autoFocus: {type: Boolean, default: false},

    automaticUploads: {type: Boolean, default: true},

    relativeUrls : {type: Boolean, default: false},

    removeScriptHost: {type: Boolean, default: false},

    width: {type: [Number,String], default: "100%"},

    textpattern_patterns: {type: Array, default: ()=>[
            {start: '#', format: ''},
            {start: '##', format: 'h2'},
            {start: '###', format: 'h3'},
            {start: '####', format: 'h4'},
            {start: '#####', format: 'h5'},
            {start: '######', format: 'h6'},
            {start: '* ', cmd: 'InsertUnorderedList'},
            {start: '- ', cmd: 'InsertUnorderedList'},
            {start: '1. ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'decimal' }},
            {start: '1) ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'decimal' }},
            {start: 'a. ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-alpha' }},
            {start: 'a) ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-alpha' }},
            {start: 'i. ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-roman' }},
            {start: 'i) ', cmd: 'InsertOrderedList', value: { 'list-style-type': 'lower-roman' }}
        ]},
}
