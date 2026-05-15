const buttonAuthCode = {
  // 博客文章相关
  blog: {
    // 文章列表
    article: {
      add: 'btn:blog:article:add',
      batchDel: 'btn:blog:article:batchDel',
      delete: 'btn:blog:article:delete',
      edit: 'btn:blog:article:edit',
      view: 'btn:blog:article:view'
    },
    // 作者信息
    author: {
      descAdd: 'btn:blog:author:descAdd',
      descEdit: 'btn:blog:author:descEdit',
      infoAdd: 'btn:blog:author:infoAdd',
      infoEdit: 'btn:blog:author:infoEdit'
    },
    // 文章分类 + 标签管理
    category: {
      add: 'btn:blog:category:add',
      delete: 'btn:blog:category:delete',
      edit: 'btn:blog:category:edit',
      // 标签管理
      tag: {
        add: 'btn:blog:category:tag:add',
        delete: 'btn:blog:category:tag:delete',
        edit: 'btn:blog:category:tag:edit'
      },
      tagManage: 'btn:blog:category:tagManage'
    },
    // 工作经历
    experience: {
      add: 'btn:blog:experience:add',
      delete: 'btn:blog:experience:delete',
      edit: 'btn:blog:experience:edit'
    }
  },

  // 功能权限
  function: {
    auth: {
      admin: {
        view: 'btn:function:auth:admin:view' // 管理员可见
      },
      super: {
        view: 'btn:function:auth:super:view' // 超级管理员可见
      },
      user: {
        view: 'btn:function:auth:user:view' // 管理员用户可见
      }
    }
  },

  system: {
    // 按钮管理
    button: {
      add: 'btn:sys:button:add',
      batchDel: 'btn:sys:button:batchDel',
      delete: 'btn:sys:button:delete',
      edit: 'btn:sys:button:edit'
    },
    // 日志记录
    log: {
      batchDel: 'btn:sys:log:batchDel',
      delete: 'btn:sys:log:delete'
    },
    // 菜单管理
    menu: {
      add: 'btn:sys:menu:add',
      addChild: 'btn:sys:menu:addChild', // 新增子菜单
      delete: 'btn:sys:menu:delete',
      edit: 'btn:sys:menu:edit'
    },
    // 角色管理
    role: {
      add: 'btn:sys:role:add',
      batchDel: 'btn:sys:role:batchDel',
      delete: 'btn:sys:role:delete',
      detail: 'btn:sys:role:detail',
      edit: 'btn:sys:role:edit'
    },
    // 用户管理
    user: {
      add: 'btn:sys:user:add',
      batchDel: 'btn:sys:user:batchDel',
      delete: 'btn:sys:user:delete',
      detail: 'btn:sys:user:detail',
      edit: 'btn:sys:user:edit'
    }
  }
};

export default buttonAuthCode;
