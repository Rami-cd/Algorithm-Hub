
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}


export function sortedArrayToBinaryTree(nums) {
    if (!nums || nums.length === 0) {
        return null;
    }
    function buildTree(size, index) {
        if (index >= size) {
            return null;
        }
        if(isNaN(nums[index])) {
            return null;    
        }else{
            let node = new TreeNode(nums[index]);
            node.left = buildTree(size, index*2+1);
            node.right = buildTree(size, index*2+2);
            return node;
        }
    }
    return buildTree(nums.length, 0);
}

export function inorderTraversal(root) {
    const result = [];
    function traverse(node) {
        if (node === null) {
            return;
        }
        traverse(node.left);
        result.push(node.val);
        traverse(node.right);
    }
    traverse(root);
    return result;
}

export function preorderTraversal(root) {
    const result = [];
    function traverse(node) {
        if (node === null) {
            return;
        }
        result.push(node.val);
        traverse(node.left);
        traverse(node.right);
    }
    traverse(root);
    return result;
}

export function postorderTraversal(root) {
    const result = [];
    function traverse(node) {
        if (node === null) {
            return;
        }
        traverse(node.left);
        traverse(node.right);
        result.push(node.val);
    }
    traverse(root);
    return result;
}
