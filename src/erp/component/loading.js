let div;
function create() {
    if(div) return;
    div = document.createElement('div')
    div.className = 'page-loading'
    document.body.appendChild(div);
}
function destroy(){
    if(!div) return;
    div.remove();
    div = null;
}
const loading = {
    create,
    destroy
};
export default loading;
