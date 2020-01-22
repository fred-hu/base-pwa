// 新建库
let request = window.indexedDB.open('mydb', 1);
request.onerror = function(event) {
  console.log('数据库打开报错');
};
request.onsuccess = e => {
  // 得到数据库
  let db = e.target.result;
  // 代码层面必须通过 db.transaction() 方法向数据库容器提出事务要求
  let transaction = db.transaction(['mystore'], 'readonly');
  // 通过事务获取objectStore
  let objectStore = transaction.objectStore('mystore');
  // 通过objectStore去查询
  let objectRequest = objectStore.get('123456');
  objectRequest.onsuccess = e => {
    // 获取到的数据
    let object = e.target.result;
    console.log('查询结果：', object);
  };
};
request.onupgradeneeded = e => {
  let db = e.target.result;
  let objectStore;
  // 如果不存在同名的 Store，就创建一个
  if (!db.objectStoreNames.contains('mystore')) {
    // 新建表 ps:关系型数据库中不必一定有 primaryKey，而 objectStore 中的 keyPath 必须有
    objectStore = db.createObjectStore('mystore', { keyPath: 'id' });
    // 创建 id 为索引
    objectStore.createIndex('id', 'id', { unique: true });
    // 写入一条数据
    objectStore.add({
      id: '123456',
      name: 'hello'
    });
  } else {
    objectStore = e.target.transaction.objectStore('mystore');
  }
};
